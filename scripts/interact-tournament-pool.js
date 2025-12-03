const hre = require("hardhat");

/**
 * Example script for interacting with deployed TournamentPrizePool contract
 *
 * This demonstrates the complete flow:
 * 1. Fund the prize pool
 * 2. Set winners
 * 3. Distribute prizes
 *
 * Usage:
 * 1. Update CONTRACT_ADDRESS with your deployed contract
 * 2. Run: npx hardhat run scripts/interact-tournament-pool.js --network baseSepolia
 */

// ⚠️ UPDATE THIS WITH YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "0x..."; // Replace with actual address from deployment

async function main() {
  console.log("🎾 PadelFlow Tournament Prize Pool - Interaction Demo\n");

  // Get signer (organizer)
  const [organizer] = await hre.ethers.getSigners();
  console.log("👤 Organizer address:", organizer.address);

  // Get contract instance
  const TournamentPrizePool = await hre.ethers.getContractFactory("TournamentPrizePool");
  const contract = TournamentPrizePool.attach(CONTRACT_ADDRESS);

  console.log("📍 Contract address:", CONTRACT_ADDRESS);
  console.log("");

  // ==================================================
  // STEP 1: Check current contract state
  // ==================================================
  console.log("📊 STEP 1: Current Contract State");
  console.log("=====================================");

  const info = await contract.getTournamentInfo();
  console.log("Tournament ID:", info.id.toString());
  console.log("Name:", info.name);
  console.log("Format:", info.format);
  console.log("Prize Pool:", hre.ethers.formatEther(info.prizePool), "ETH");
  console.log("Prizes Distributed:", info.distributed);
  console.log("");

  // ==================================================
  // STEP 2: Fund the prize pool
  // ==================================================
  console.log("💰 STEP 2: Funding Prize Pool");
  console.log("=====================================");

  const fundAmount = hre.ethers.parseEther("0.1"); // 0.1 ETH for demo
  console.log("Funding with:", hre.ethers.formatEther(fundAmount), "ETH");

  const fundTx = await contract.fundPrizePool({ value: fundAmount });
  console.log("Transaction hash:", fundTx.hash);

  await fundTx.wait();
  console.log("✅ Prize pool funded!");

  const newBalance = await contract.getBalance();
  console.log("New contract balance:", hre.ethers.formatEther(newBalance), "ETH");
  console.log("");

  // ==================================================
  // STEP 3: Set winners and distribution
  // ==================================================
  console.log("🏆 STEP 3: Setting Winners");
  console.log("=====================================");

  // Example winner addresses (replace with actual player wallets)
  // In production, these come from your database after tournament ends
  const winner1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // 1st place
  const winner2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // 2nd place
  const winner3 = "0x90F79bf6EB2c4f870365E785982E1f101E93b906"; // 3rd place

  // Prize distribution: [50%, 30%, 20%]
  // You can also use [60, 30, 10] or custom percentages
  const distribution = [50, 30, 20];

  console.log("1st Place:", winner1, "→", distribution[0] + "%");
  console.log("2nd Place:", winner2, "→", distribution[1] + "%");
  console.log("3rd Place:", winner3, "→", distribution[2] + "%");
  console.log("");

  const setWinnersTx = await contract.setWinners(
    winner1,
    winner2,
    winner3,
    distribution
  );

  console.log("Transaction hash:", setWinnersTx.hash);
  await setWinnersTx.wait();
  console.log("✅ Winners set successfully!");
  console.log("");

  // Verify winners
  const winners = await contract.getWinners();
  console.log("Verified Winner Info:");
  console.log("1st:", winners.first, "→", hre.ethers.formatEther(winners.firstPrize), "ETH");
  console.log("2nd:", winners.second, "→", hre.ethers.formatEther(winners.secondPrize), "ETH");
  console.log("3rd:", winners.third, "→", hre.ethers.formatEther(winners.thirdPrize), "ETH");
  console.log("");

  // ==================================================
  // STEP 4: Distribute prizes
  // ==================================================
  console.log("💸 STEP 4: Distributing Prizes");
  console.log("=====================================");

  // Get balances before distribution
  const balance1Before = await hre.ethers.provider.getBalance(winner1);
  const balance2Before = await hre.ethers.provider.getBalance(winner2);
  const balance3Before = await hre.ethers.provider.getBalance(winner3);

  console.log("Balances before distribution:");
  console.log("1st:", hre.ethers.formatEther(balance1Before), "ETH");
  console.log("2nd:", hre.ethers.formatEther(balance2Before), "ETH");
  console.log("3rd:", hre.ethers.formatEther(balance3Before), "ETH");
  console.log("");

  console.log("Executing prize distribution...");
  const distributeTx = await contract.distributePrizes();
  console.log("Transaction hash:", distributeTx.hash);

  const receipt = await distributeTx.wait();
  console.log("✅ Prizes distributed in block:", receipt.blockNumber);
  console.log("");

  // Get balances after distribution
  const balance1After = await hre.ethers.provider.getBalance(winner1);
  const balance2After = await hre.ethers.provider.getBalance(winner2);
  const balance3After = await hre.ethers.provider.getBalance(winner3);

  console.log("Balances after distribution:");
  console.log("1st:", hre.ethers.formatEther(balance1After), "ETH", "(+", hre.ethers.formatEther(balance1After - balance1Before), ")");
  console.log("2nd:", hre.ethers.formatEther(balance2After), "ETH", "(+", hre.ethers.formatEther(balance2After - balance2Before), ")");
  console.log("3rd:", hre.ethers.formatEther(balance3After), "ETH", "(+", hre.ethers.formatEther(balance3After - balance3Before), ")");
  console.log("");

  // Verify contract is empty
  const finalBalance = await contract.getBalance();
  console.log("Final contract balance:", hre.ethers.formatEther(finalBalance), "ETH");

  // Check if prizes were distributed
  const finalInfo = await contract.getTournamentInfo();
  console.log("Prizes distributed:", finalInfo.distributed);
  console.log("");

  // ==================================================
  // Summary
  // ==================================================
  console.log("📊 TRANSACTION SUMMARY");
  console.log("=====================================");
  console.log("Total prize pool:", hre.ethers.formatEther(fundAmount), "ETH");
  console.log("1st place received:", hre.ethers.formatEther(balance1After - balance1Before), "ETH");
  console.log("2nd place received:", hre.ethers.formatEther(balance2After - balance2Before), "ETH");
  console.log("3rd place received:", hre.ethers.formatEther(balance3After - balance3Before), "ETH");
  console.log("");

  if (hre.network.name === "baseSepolia" || hre.network.name === "base") {
    console.log("🔗 View transactions on Block Explorer:");
    const explorerBase = hre.network.name === "baseSepolia"
      ? "https://sepolia.basescan.org/tx/"
      : "https://basescan.org/tx/";

    console.log("Fund TX:", explorerBase + fundTx.hash);
    console.log("Set Winners TX:", explorerBase + setWinnersTx.hash);
    console.log("Distribute TX:", explorerBase + distributeTx.hash);
  }

  console.log("\n✨ Tournament prize distribution completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
