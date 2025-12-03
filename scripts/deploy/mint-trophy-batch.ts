import { ethers } from "hardhat";

/**
 * Batch mint NFT Trophies for a tournament
 *
 * Usage:
 * npx hardhat run scripts/deploy/mint-trophy-batch.ts --network baseSepolia
 */

async function main() {
  // Configuration - UPDATE THESE VALUES
  const CONTRACT_ADDRESS = process.env.NFT_TROPHY_CONTRACT_ADDRESS || "";
  const TOURNAMENT_ID = process.env.TOURNAMENT_ID || "tournament-123";
  const TOURNAMENT_NAME = process.env.TOURNAMENT_NAME || "PadelFlow Championship 2025";

  // Example winners data
  const winners = [
    {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", // Replace with actual address
      place: 1,
      name: "First Place Winner",
      metadataURI: "ipfs://QmExample1..."
    },
    {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2", // Replace with actual address
      place: 2,
      name: "Second Place Winner",
      metadataURI: "ipfs://QmExample2..."
    },
    {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3", // Replace with actual address
      place: 3,
      name: "Third Place Winner",
      metadataURI: "ipfs://QmExample3..."
    }
  ];

  if (!CONTRACT_ADDRESS) {
    console.error("❌ Error: NFT_TROPHY_CONTRACT_ADDRESS environment variable is required");
    process.exit(1);
  }

  console.log("🏆 Batch Minting PadelFlow NFT Trophies...\n");

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log("📝 Minting with account:", signer.address);

  // Get the contract
  const PadelFlowNFTTrophy = await ethers.getContractFactory("PadelFlowNFTTrophy");
  const nftTrophy = PadelFlowNFTTrophy.attach(CONTRACT_ADDRESS);

  console.log("📋 Batch Mint Details:");
  console.log("   - Contract:", CONTRACT_ADDRESS);
  console.log("   - Tournament ID:", TOURNAMENT_ID);
  console.log("   - Tournament Name:", TOURNAMENT_NAME);
  console.log("   - Number of winners:", winners.length);

  console.log("\n👥 Winners:");
  winners.forEach((winner, idx) => {
    console.log(`   ${idx + 1}. Place ${winner.place}: ${winner.name} (${winner.address})`);
  });

  // Prepare arrays for batch minting
  const addresses = winners.map(w => w.address);
  const places = winners.map(w => w.place);
  const names = winners.map(w => w.name);
  const metadataURIs = winners.map(w => w.metadataURI);

  console.log("\n⏳ Batch minting NFTs...");

  try {
    const tx = await nftTrophy.mintBatch(
      addresses,
      TOURNAMENT_ID,
      TOURNAMENT_NAME,
      places,
      names,
      metadataURIs
    );

    console.log("📤 Transaction sent:", tx.hash);
    console.log("⏳ Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt?.blockNumber);

    // Get the token IDs from the batch event
    const batchEvent = receipt?.logs.find((log: any) => {
      try {
        const parsedLog = nftTrophy.interface.parseLog(log);
        return parsedLog?.name === "TrophyBatchMinted";
      } catch {
        return false;
      }
    });

    if (batchEvent) {
      const parsedEvent = nftTrophy.interface.parseLog(batchEvent);
      const tokenIds = parsedEvent?.args[1];
      console.log("\n🎉 NFT Trophies minted successfully!");
      console.log("   - Token IDs:", tokenIds.map((id: any) => id.toString()).join(", "));
    }

    // Get total minted count
    const totalMinted = await nftTrophy.totalMinted();
    console.log("\n📊 Total trophies minted:", totalMinted.toString());

    // Get tournament tokens
    const tournamentTokens = await nftTrophy.getTournamentTokens(TOURNAMENT_ID);
    console.log("📊 Tokens for this tournament:", tournamentTokens.map((id: any) => id.toString()).join(", "));

  } catch (error: any) {
    console.error("❌ Batch minting failed:", error.message);
    if (error.message.includes("Recipient already has trophy")) {
      console.error("   Some recipients may have already received trophies for this tournament.");
    }
    process.exit(1);
  }

  console.log("\n✨ Batch minting complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
