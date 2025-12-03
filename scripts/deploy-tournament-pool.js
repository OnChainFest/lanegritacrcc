const hre = require("hardhat");

/**
 * Deploy TournamentPrizePool contract to Base Sepolia
 *
 * Usage:
 * npx hardhat run scripts/deploy-tournament-pool.js --network baseSepolia
 *
 * Or for local testing:
 * npx hardhat run scripts/deploy-tournament-pool.js --network hardhat
 */
async function main() {
  console.log("🚀 Starting TournamentPrizePool deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Example tournament data
  // In production, these would come from your backend/database
  const tournamentId = Date.now(); // Unique ID (timestamp for demo)
  const tournamentName = "Demo Tournament - Verano 2025";
  const tournamentFormat = "americano"; // or "round-robin", "eliminacion", "liga"
  const organizerAddress = deployer.address; // In production, this would be the Gnosis Safe address

  console.log("🎾 Tournament Details:");
  console.log("   ID:", tournamentId);
  console.log("   Name:", tournamentName);
  console.log("   Format:", tournamentFormat);
  console.log("   Organizer:", organizerAddress);
  console.log("");

  // Deploy contract
  console.log("⏳ Deploying TournamentPrizePool contract...");
  const TournamentPrizePool = await hre.ethers.getContractFactory("TournamentPrizePool");
  const contract = await TournamentPrizePool.deploy(
    tournamentId,
    tournamentName,
    tournamentFormat,
    organizerAddress
  );

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✅ TournamentPrizePool deployed to:", contractAddress);
  console.log("");

  // Verify deployment
  const info = await contract.getTournamentInfo();
  console.log("🔍 Deployed Contract Info:");
  console.log("   Tournament ID:", info.id.toString());
  console.log("   Name:", info.name);
  console.log("   Format:", info.format);
  console.log("   Prize Pool:", hre.ethers.formatEther(info.prizePool), "ETH");
  console.log("   Distributed:", info.distributed);
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    tournamentId: tournamentId,
    tournamentName: tournamentName,
    tournamentFormat: tournamentFormat,
    organizerAddress: organizerAddress,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  console.log("📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("");

  // Instructions for next steps
  console.log("📚 Next Steps:");
  console.log("1. Fund the prize pool:");
  console.log(`   await contract.fundPrizePool({ value: ethers.parseEther("1.0") })`);
  console.log("");
  console.log("2. Set winners after tournament ends:");
  console.log(`   await contract.setWinners(winner1, winner2, winner3, [50, 30, 20])`);
  console.log("");
  console.log("3. Distribute prizes:");
  console.log(`   await contract.distributePrizes()`);
  console.log("");

  if (hre.network.name === "baseSepolia" || hre.network.name === "base") {
    console.log("🔗 View on Block Explorer:");
    const explorerUrl = hre.network.name === "baseSepolia"
      ? `https://sepolia.basescan.org/address/${contractAddress}`
      : `https://basescan.org/address/${contractAddress}`;
    console.log(explorerUrl);
    console.log("");

    console.log("⏳ Waiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    try {
      console.log("🔍 Verifying contract on Basescan...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [
          tournamentId,
          tournamentName,
          tournamentFormat,
          organizerAddress,
        ],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
      console.log("You can verify manually later with:");
      console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} ${tournamentId} "${tournamentName}" "${tournamentFormat}" ${organizerAddress}`);
    }
  }

  return deploymentInfo;
}

// Execute deployment
main()
  .then((info) => {
    console.log("\n✨ Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
