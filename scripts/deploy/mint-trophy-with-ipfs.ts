import { ethers } from "hardhat";
import { uploadTrophyMetadata } from "../../lib/ipfs/upload-trophy-metadata";
import type { TournamentData, WinnerData } from "../../lib/ipfs/metadata";

/**
 * Mint NFT Trophy with IPFS metadata upload
 *
 * This script:
 * 1. Uploads trophy image to IPFS (if provided, or uses default)
 * 2. Generates and uploads NFT metadata to IPFS
 * 3. Mints the NFT with the IPFS metadata URI
 *
 * Usage:
 * npx hardhat run scripts/deploy/mint-trophy-with-ipfs.ts --network baseSepolia
 */

async function main() {
  // =============================================================================
  // CONFIGURATION - UPDATE THESE VALUES
  // =============================================================================

  const CONTRACT_ADDRESS = process.env.NFT_TROPHY_CONTRACT_ADDRESS || "";
  const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS || "";

  // Tournament data
  const tournament: TournamentData = {
    tournamentId: process.env.TOURNAMENT_ID || "tournament-123",
    tournamentName: process.env.TOURNAMENT_NAME || "PadelFlow Championship 2025",
    tournamentDate: process.env.TOURNAMENT_DATE || new Date().toISOString(),
    location: process.env.TOURNAMENT_LOCATION || "Miami, FL",
    format: (process.env.TOURNAMENT_FORMAT as any) || "americano",
    totalPlayers: parseInt(process.env.TOTAL_PLAYERS || "32"),
    prizePool: process.env.PRIZE_POOL || undefined
  };

  // Winner data
  const winner: WinnerData = {
    place: parseInt(process.env.PLACE || "1"),
    winnerName: process.env.WINNER_NAME || "Test Winner",
    partnerName: process.env.PARTNER_NAME || undefined,
    finalScore: process.env.FINAL_SCORE || undefined
  };

  // Image source (URL, file path, or null for default)
  const imageSource = process.env.TROPHY_IMAGE || null;

  // =============================================================================
  // VALIDATION
  // =============================================================================

  if (!CONTRACT_ADDRESS) {
    console.error("❌ Error: NFT_TROPHY_CONTRACT_ADDRESS environment variable is required");
    process.exit(1);
  }

  if (!RECIPIENT_ADDRESS) {
    console.error("❌ Error: RECIPIENT_ADDRESS environment variable is required");
    process.exit(1);
  }

  console.log("🏆 Minting PadelFlow NFT Trophy with IPFS metadata...\n");

  // =============================================================================
  // STEP 1: UPLOAD METADATA TO IPFS
  // =============================================================================

  console.log("📋 Tournament Details:");
  console.log("   - ID:", tournament.tournamentId);
  console.log("   - Name:", tournament.tournamentName);
  console.log("   - Format:", tournament.format);
  console.log("   - Total Players:", tournament.totalPlayers);
  if (tournament.location) console.log("   - Location:", tournament.location);
  if (tournament.prizePool) console.log("   - Prize Pool:", tournament.prizePool);

  console.log("\n🏅 Winner Details:");
  console.log("   - Place:", winner.place);
  console.log("   - Name:", winner.winnerName);
  if (winner.partnerName) console.log("   - Partner:", winner.partnerName);
  if (winner.finalScore) console.log("   - Score:", winner.finalScore);

  console.log("\n📤 Step 1: Uploading metadata to IPFS...\n");

  let metadataUri: string;
  try {
    // Get the signer for organizer address
    const [signer] = await ethers.getSigners();

    const uploadResult = await uploadTrophyMetadata(
      tournament,
      winner,
      imageSource,
      signer.address
    );

    metadataUri = uploadResult.metadataUri;

    console.log("\n✅ IPFS Upload Complete:");
    console.log("   - Image URI:", uploadResult.imageUri);
    console.log("   - Image Hash:", uploadResult.imageHash);
    console.log("   - Metadata URI:", uploadResult.metadataUri);
    console.log("   - Metadata Hash:", uploadResult.metadataHash);
    console.log("\n   NFT Metadata:");
    console.log("   ", JSON.stringify(uploadResult.metadata, null, 6));
  } catch (error: any) {
    console.error("\n❌ IPFS upload failed:", error.message);
    console.error("\nPlease check:");
    console.error("   - PINATA_API_KEY and PINATA_API_SECRET are set in .env");
    console.error("   - OR PINATA_JWT is set in .env");
    console.error("   - Your Pinata account is active and has sufficient storage");
    process.exit(1);
  }

  // =============================================================================
  // STEP 2: MINT NFT WITH METADATA URI
  // =============================================================================

  console.log("\n⛏️  Step 2: Minting NFT on blockchain...\n");

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log("📝 Minting with account:", signer.address);

  // Get the contract
  const PadelFlowNFTTrophy = await ethers.getContractFactory("PadelFlowNFTTrophy");
  const nftTrophy = PadelFlowNFTTrophy.attach(CONTRACT_ADDRESS);

  console.log("📋 Mint Details:");
  console.log("   - Contract:", CONTRACT_ADDRESS);
  console.log("   - Recipient:", RECIPIENT_ADDRESS);
  console.log("   - Metadata URI:", metadataUri);

  console.log("\n⏳ Minting NFT...");

  try {
    const tx = await nftTrophy.mint(
      RECIPIENT_ADDRESS,
      tournament.tournamentId,
      tournament.tournamentName,
      winner.place,
      winner.winnerName,
      metadataUri
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

      console.log("\n🎉 NFT Trophy minted successfully!");
      console.log("   - Token ID:", tokenId.toString());
      console.log("   - Recipient:", RECIPIENT_ADDRESS);
      console.log("   - Place:", winner.place);
      console.log("   - Metadata URI:", metadataUri);
    }

    // Get total minted count
    const totalMinted = await nftTrophy.totalMinted();
    console.log("\n📊 Total trophies minted:", totalMinted.toString());

    // Get network info
    const network = await ethers.provider.getNetwork();
    const explorerUrl = getExplorerUrl(Number(network.chainId), tx.hash);
    if (explorerUrl) {
      console.log("\n🔍 View on Explorer:", explorerUrl);
    }

  } catch (error: any) {
    console.error("\n❌ Minting failed:", error.message);
    if (error.message.includes("Recipient already has trophy")) {
      console.error("   The recipient already has a trophy for this tournament.");
    }
    process.exit(1);
  }

  console.log("\n✨ Minting complete! The NFT Trophy is now on the blockchain with IPFS metadata.");
}

/**
 * Get block explorer URL for transaction
 */
function getExplorerUrl(chainId: number, txHash: string): string | null {
  const explorers: Record<number, string> = {
    84532: "https://sepolia.basescan.org/tx/", // Base Sepolia
    8453: "https://basescan.org/tx/", // Base Mainnet
    1440002: "https://evm-sidechain.xrpl.org/tx/" // XRPL EVM
  };

  const baseUrl = explorers[chainId];
  return baseUrl ? `${baseUrl}${txHash}` : null;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
