const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TournamentPrizePool", function () {
  let TournamentPrizePool;
  let contract;
  let organizer;
  let winner1, winner2, winner3;
  let otherAccount;

  const TOURNAMENT_ID = 123456;
  const TOURNAMENT_NAME = "Test Tournament 2025";
  const TOURNAMENT_FORMAT = "americano";
  const PRIZE_POOL_AMOUNT = ethers.parseEther("10.0"); // 10 ETH

  beforeEach(async function () {
    // Get test accounts
    [organizer, winner1, winner2, winner3, otherAccount] = await ethers.getSigners();

    // Deploy contract
    TournamentPrizePool = await ethers.getContractFactory("TournamentPrizePool");
    contract = await TournamentPrizePool.deploy(
      TOURNAMENT_ID,
      TOURNAMENT_NAME,
      TOURNAMENT_FORMAT,
      organizer.address
    );

    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct tournament details", async function () {
      const info = await contract.getTournamentInfo();

      expect(info.id).to.equal(TOURNAMENT_ID);
      expect(info.name).to.equal(TOURNAMENT_NAME);
      expect(info.format).to.equal(TOURNAMENT_FORMAT);
      expect(info.prizePool).to.equal(0);
      expect(info.distributed).to.equal(false);
    });

    it("Should set the organizer as owner", async function () {
      expect(await contract.owner()).to.equal(organizer.address);
    });

    it("Should start with zero prize pool", async function () {
      const balance = await contract.getBalance();
      expect(balance).to.equal(0);
    });
  });

  describe("Funding", function () {
    it("Should allow owner to fund prize pool", async function () {
      await expect(contract.fundPrizePool({ value: PRIZE_POOL_AMOUNT }))
        .to.emit(contract, "PrizePoolFunded")
        .withArgs(organizer.address, PRIZE_POOL_AMOUNT, await getBlockTimestamp());

      const info = await contract.getTournamentInfo();
      expect(info.prizePool).to.equal(PRIZE_POOL_AMOUNT);
    });

    it("Should allow multiple fundings", async function () {
      await contract.fundPrizePool({ value: ethers.parseEther("5.0") });
      await contract.fundPrizePool({ value: ethers.parseEther("3.0") });

      const info = await contract.getTournamentInfo();
      expect(info.prizePool).to.equal(ethers.parseEther("8.0"));
    });

    it("Should accept direct ETH transfers via receive()", async function () {
      await organizer.sendTransaction({
        to: await contract.getAddress(),
        value: PRIZE_POOL_AMOUNT,
      });

      const info = await contract.getTournamentInfo();
      expect(info.prizePool).to.equal(PRIZE_POOL_AMOUNT);
    });

    it("Should revert if non-owner tries to fund", async function () {
      await expect(
        contract.connect(otherAccount).fundPrizePool({ value: PRIZE_POOL_AMOUNT })
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });

    it("Should revert if funding with 0 value", async function () {
      await expect(
        contract.fundPrizePool({ value: 0 })
      ).to.be.revertedWith("Must send funds");
    });
  });

  describe("Setting Winners", function () {
    beforeEach(async function () {
      // Fund the prize pool first
      await contract.fundPrizePool({ value: PRIZE_POOL_AMOUNT });
    });

    it("Should set winners with 50-30-20 distribution", async function () {
      const distribution = [50, 30, 20];

      await contract.setWinners(
        winner1.address,
        winner2.address,
        winner3.address,
        distribution
      );

      const winners = await contract.getWinners();

      expect(winners.first).to.equal(winner1.address);
      expect(winners.second).to.equal(winner2.address);
      expect(winners.third).to.equal(winner3.address);

      // Check prize amounts (50%, 30%, 20% of 10 ETH)
      expect(winners.firstPrize).to.equal(ethers.parseEther("5.0"));
      expect(winners.secondPrize).to.equal(ethers.parseEther("3.0"));
      expect(winners.thirdPrize).to.equal(ethers.parseEther("2.0"));
    });

    it("Should set winners with 60-30-10 distribution", async function () {
      const distribution = [60, 30, 10];

      await contract.setWinners(
        winner1.address,
        winner2.address,
        winner3.address,
        distribution
      );

      const winners = await contract.getWinners();

      expect(winners.firstPrize).to.equal(ethers.parseEther("6.0"));
      expect(winners.secondPrize).to.equal(ethers.parseEther("3.0"));
      expect(winners.thirdPrize).to.equal(ethers.parseEther("1.0"));
    });

    it("Should emit WinnersSet event", async function () {
      await expect(
        contract.setWinners(
          winner1.address,
          winner2.address,
          winner3.address,
          [50, 30, 20]
        )
      )
        .to.emit(contract, "WinnersSet")
        .withArgs(winner1.address, winner2.address, winner3.address, await getBlockTimestamp());
    });

    it("Should revert if percentages don't add to 100", async function () {
      await expect(
        contract.setWinners(
          winner1.address,
          winner2.address,
          winner3.address,
          [50, 30, 15] // Only 95%
        )
      ).to.be.revertedWith("Percentages must add up to 100");
    });

    it("Should revert if duplicate winners", async function () {
      await expect(
        contract.setWinners(
          winner1.address,
          winner1.address, // Duplicate
          winner3.address,
          [50, 30, 20]
        )
      ).to.be.revertedWith("Winners must be different");
    });

    it("Should revert if invalid addresses", async function () {
      await expect(
        contract.setWinners(
          ethers.ZeroAddress,
          winner2.address,
          winner3.address,
          [50, 30, 20]
        )
      ).to.be.revertedWith("Invalid 1st place address");
    });

    it("Should revert if non-owner tries to set winners", async function () {
      await expect(
        contract.connect(otherAccount).setWinners(
          winner1.address,
          winner2.address,
          winner3.address,
          [50, 30, 20]
        )
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });
  });

  describe("Prize Distribution", function () {
    beforeEach(async function () {
      // Fund and set winners
      await contract.fundPrizePool({ value: PRIZE_POOL_AMOUNT });
      await contract.setWinners(
        winner1.address,
        winner2.address,
        winner3.address,
        [50, 30, 20]
      );
    });

    it("Should distribute prizes correctly", async function () {
      const balance1Before = await ethers.provider.getBalance(winner1.address);
      const balance2Before = await ethers.provider.getBalance(winner2.address);
      const balance3Before = await ethers.provider.getBalance(winner3.address);

      await contract.distributePrizes();

      const balance1After = await ethers.provider.getBalance(winner1.address);
      const balance2After = await ethers.provider.getBalance(winner2.address);
      const balance3After = await ethers.provider.getBalance(winner3.address);

      expect(balance1After - balance1Before).to.equal(ethers.parseEther("5.0"));
      expect(balance2After - balance2Before).to.equal(ethers.parseEther("3.0"));
      expect(balance3After - balance3Before).to.equal(ethers.parseEther("2.0"));
    });

    it("Should emit PrizesDistributed event", async function () {
      await expect(contract.distributePrizes())
        .to.emit(contract, "PrizesDistributed");
    });

    it("Should mark prizes as distributed", async function () {
      await contract.distributePrizes();

      const info = await contract.getTournamentInfo();
      expect(info.distributed).to.equal(true);
    });

    it("Should empty the contract balance", async function () {
      await contract.distributePrizes();

      const balance = await contract.getBalance();
      expect(balance).to.equal(0);
    });

    it("Should revert if trying to distribute twice", async function () {
      await contract.distributePrizes();

      await expect(
        contract.distributePrizes()
      ).to.be.revertedWith("Prizes already distributed");
    });

    it("Should revert if winners not set", async function () {
      // Deploy new contract without setting winners
      const newContract = await TournamentPrizePool.deploy(
        999,
        "New Tournament",
        "liga",
        organizer.address
      );

      await newContract.fundPrizePool({ value: PRIZE_POOL_AMOUNT });

      await expect(
        newContract.distributePrizes()
      ).to.be.revertedWith("Winners not set");
    });

    it("Should revert if non-owner tries to distribute", async function () {
      await expect(
        contract.connect(otherAccount).distributePrizes()
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });
  });

  describe("Emergency Withdrawal", function () {
    beforeEach(async function () {
      await contract.fundPrizePool({ value: PRIZE_POOL_AMOUNT });
    });

    it("Should allow owner to emergency withdraw", async function () {
      const balanceBefore = await ethers.provider.getBalance(organizer.address);

      const tx = await contract.emergencyWithdraw();
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed * receipt.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(organizer.address);

      // Account for gas costs
      const expectedBalance = balanceBefore + PRIZE_POOL_AMOUNT - gasCost;
      expect(balanceAfter).to.be.closeTo(expectedBalance, ethers.parseEther("0.001"));
    });

    it("Should emit EmergencyWithdrawal event", async function () {
      await expect(contract.emergencyWithdraw())
        .to.emit(contract, "EmergencyWithdrawal")
        .withArgs(organizer.address, PRIZE_POOL_AMOUNT, await getBlockTimestamp());
    });

    it("Should revert if already distributed", async function () {
      await contract.setWinners(
        winner1.address,
        winner2.address,
        winner3.address,
        [50, 30, 20]
      );
      await contract.distributePrizes();

      await expect(
        contract.emergencyWithdraw()
      ).to.be.revertedWith("Prizes already distributed");
    });

    it("Should revert if non-owner tries to withdraw", async function () {
      await expect(
        contract.connect(otherAccount).emergencyWithdraw()
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });
  });

  // Helper function to get current block timestamp
  async function getBlockTimestamp() {
    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    return block.timestamp;
  }
});
