import { ethers } from "hardhat";

/**
 * Deploy PadelFlowNFTTrophy contract
 *
 * Usage:
 * npx hardhat run scripts/deploy/deploy-nft-trophy.ts --network baseSepolia
 * npx hardhat run scripts/deploy/deploy-nft-trophy.ts --network base
 * npx hardhat run scripts/deploy/deploy-nft-trophy.ts --network xrplEvm
 */

async function main() {
  console.log("🚀 Deploying PadelFlowNFTTrophy contract...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  // Get the contract factory
  const PadelFlowNFTTrophy = await ethers.getContractFactory("PadelFlowNFTTrophy");

  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const nftTrophy = await PadelFlowNFTTrophy.deploy(deployer.address);

  await nftTrophy.waitForDeployment();

  const contractAddress = await nftTrophy.getAddress();

  console.log("✅ PadelFlowNFTTrophy deployed to:", contractAddress);
  console.log("🔑 Owner:", deployer.address);
  console.log("\n📋 Contract Details:");
  console.log("   - Name: PadelFlow Trophy");
  console.log("   - Symbol: PFTROPHY");
  console.log("   - Network:", (await ethers.provider.getNetwork()).name);
  console.log("   - Chain ID:", (await ethers.provider.getNetwork()).chainId);

  // Wait for a few block confirmations before verification
  console.log("\n⏳ Waiting for block confirmations...");
  await nftTrophy.deploymentTransaction()?.wait(5);
  console.log("✅ Block confirmations complete");

  console.log("\n📝 Save this information:");
  console.log("   Contract Address:", contractAddress);
  console.log("   Deployer Address:", deployer.address);
  console.log("   Transaction Hash:", nftTrophy.deploymentTransaction()?.hash);

  console.log("\n🔍 Verify contract with:");
  console.log(`   npx hardhat verify --network ${(await ethers.provider.getNetwork()).name} ${contractAddress} ${deployer.address}`);

  console.log("\n✨ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
