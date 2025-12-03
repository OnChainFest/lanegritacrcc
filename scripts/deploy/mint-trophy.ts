import { ethers } from "hardhat";

/**
 * Mint NFT Trophy to a winner
 *
 * Usage:
 * npx hardhat run scripts/deploy/mint-trophy.ts --network baseSepolia
 */

async function main() {
  // Configuration - UPDATE THESE VALUES
  const CONTRACT_ADDRESS = process.env.NFT_TROPHY_CONTRACT_ADDRESS || "";
  const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS || "";
  const TOURNAMENT_ID = process.env.TOURNAMENT_ID || "tournament-123";
  const TOURNAMENT_NAME = process.env.TOURNAMENT_NAME || "PadelFlow Championship 2025";
  const PLACE = parseInt(process.env.PLACE || "1");
  const WINNER_NAME = process.env.WINNER_NAME || "Test Winner";
  const METADATA_URI = process.env.METADATA_URI || "ipfs://QmExample...";

  if (!CONTRACT_ADDRESS) {
    console.error("❌ Error: NFT_TROPHY_CONTRACT_ADDRESS environment variable is required");
    process.exit(1);
  }

  if (!RECIPIENT_ADDRESS) {
    console.error("❌ Error: RECIPIENT_ADDRESS environment variable is required");
    process.exit(1);
  }

  console.log("🏆 Minting PadelFlow NFT Trophy...\n");

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log("📝 Minting with account:", signer.address);

  // Get the contract
  const PadelFlowNFTTrophy = await ethers.getContractFactory("PadelFlowNFTTrophy");
  const nftTrophy = PadelFlowNFTTrophy.attach(CONTRACT_ADDRESS);

  console.log("📋 Mint Details:");
  console.log("   - Contract:", CONTRACT_ADDRESS);
  console.log("   - Recipient:", RECIPIENT_ADDRESS);
  console.log("   - Tournament ID:", TOURNAMENT_ID);
  console.log("   - Tournament Name:", TOURNAMENT_NAME);
  console.log("   - Place:", PLACE);
  console.log("   - Winner Name:", WINNER_NAME);
  console.log("   - Metadata URI:", METADATA_URI);

  console.log("\n⏳ Minting NFT...");

  try {
    const tx = await nftTrophy.mint(
      RECIPIENT_ADDRESS,
      TOURNAMENT_ID,
      TOURNAMENT_NAME,
      PLACE,
      WINNER_NAME,
      METADATA_URI
    );

    console.log("📤 Transaction sent:", tx.hash);
    console.log("⏳ Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt?.blockNumber);

    // Get the token ID from the event
    const event = receipt?.logs.find((log: any) => {
      try {
        const parsedLog = nftTrophy.interface.parseLog(log);
        return parsedLog?.name === "TrophyMinted";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsedEvent = nftTrophy.interface.parseLog(event);
      const tokenId = parsedEvent?.args[0];
      console.log("🎉 NFT Trophy minted successfully!");
      console.log("   - Token ID:", tokenId.toString());
      console.log("   - Recipient:", RECIPIENT_ADDRESS);
      console.log("   - Place:", PLACE);
    }

    // Get total minted count
    const totalMinted = await nftTrophy.totalMinted();
    console.log("\n📊 Total trophies minted:", totalMinted.toString());

  } catch (error: any) {
    console.error("❌ Minting failed:", error.message);
    process.exit(1);
  }

  console.log("\n✨ Minting complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
