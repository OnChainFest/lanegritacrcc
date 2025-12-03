import { ethers } from "hardhat";
import { uploadBatchTrophyMetadata } from "../../lib/ipfs/upload-trophy-metadata";
import type { TournamentData, WinnerData } from "../../lib/ipfs/metadata";

/**
 * Batch mint NFT Trophies with IPFS metadata upload
 *
 * This script:
 * 1. Uploads all trophy images to IPFS (or uses defaults)
 * 2. Generates and uploads NFT metadata for each winner to IPFS
 * 3. Batch mints all NFTs with IPFS metadata URIs
 *
 * Usage:
 * npx hardhat run scripts/deploy/mint-trophy-batch-with-ipfs.ts --network baseSepolia
 */

async function main() {
  // =============================================================================
  // CONFIGURATION - UPDATE THESE VALUES
  // =============================================================================

  const CONTRACT_ADDRESS = process.env.NFT_TROPHY_CONTRACT_ADDRESS || "";

  // Tournament data
  const tournament: TournamentData = {
    tournamentId: process.env.TOURNAMENT_ID || "tournament-123",
    tournamentName: process.env.TOURNAMENT_NAME || "PadelFlow Championship 2025",
    tournamentDate: process.env.TOURNAMENT_DATE || new Date().toISOString(),
    location: process.env.TOURNAMENT_LOCATION || "Miami, FL",
    format: (process.env.TOURNAMENT_FORMAT as any) || "americano",
    totalPlayers: parseInt(process.env.TOTAL_PLAYERS || "32"),
    prizePool: process.env.PRIZE_POOL || "5000 USDC"
  };

  // Winners data - UPDATE THIS ARRAY
  const winners: (WinnerData & { address: string; imageSource?: string | null })[] = [
    {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", // REPLACE
      place: 1,
      winnerName: "First Place Winner",
      partnerName: "Partner 1",
      finalScore: "6-4, 6-3",
      imageSource: null // null = use default image
    },
    {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2", // REPLACE
      place: 2,
      winnerName: "Second Place Winner",
      partnerName: "Partner 2",
      finalScore: "6-4, 4-6, 7-5",
      imageSource: null
    },
    {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3", // REPLACE
      place: 3,
      winnerName: "Third Place Winner",
      partnerName: "Partner 3",
      finalScore: "6-2, 6-4",
      imageSource: null
    }
  ];

  // =============================================================================
  // VALIDATION
  // =============================================================================

  if (!CONTRACT_ADDRESS) {
    console.error("❌ Error: NFT_TROPHY_CONTRACT_ADDRESS environment variable is required");
    process.exit(1);
  }

  if (winners.length === 0) {
    console.error("❌ Error: No winners provided");
    process.exit(1);
  }

  console.log("🏆 Batch Minting PadelFlow NFT Trophies with IPFS metadata...\n");

  // =============================================================================
  // STEP 1: UPLOAD ALL METADATA TO IPFS
  // =============================================================================

  console.log("📋 Tournament Details:");
  console.log("   - ID:", tournament.tournamentId);
  console.log("   - Name:", tournament.tournamentName);
  console.log("   - Format:", tournament.format);
  console.log("   - Total Players:", tournament.totalPlayers);
  if (tournament.location) console.log("   - Location:", tournament.location);
  if (tournament.prizePool) console.log("   - Prize Pool:", tournament.prizePool);

  console.log("\n🏅 Winners:");
  winners.forEach((winner, idx) => {
    console.log(`   ${idx + 1}. Place ${winner.place}: ${winner.winnerName} (${winner.address})`);
  });

  console.log("\n📤 Step 1: Uploading all metadata to IPFS...");

  let metadataUris: string[];
  try {
    // Get the signer for organizer address
    const [signer] = await ethers.getSigners();

    // Prepare winner data and image sources
    const winnerDataArray: WinnerData[] = winners.map(w => ({
      place: w.place,
      winnerName: w.winnerName,
      partnerName: w.partnerName,
      finalScore: w.finalScore
    }));

    const imageSources = winners.map(w => w.imageSource || null);

    // Upload all metadata
    const uploadResults = await uploadBatchTrophyMetadata(
      tournament,
      winnerDataArray,
      imageSources,
      signer.address
    );

    metadataUris = uploadResults.map(r => r.metadataUri);

    console.log("\n✅ All IPFS uploads complete:");
    uploadResults.forEach((result, idx) => {
      console.log(`\n   Winner ${idx + 1} (${winners[idx].winnerName}):`);
      console.log("   - Image URI:", result.imageUri);
      console.log("   - Metadata URI:", result.metadataUri);
      console.log("   - Metadata Hash:", result.metadataHash);
    });

  } catch (error: any) {
    console.error("\n❌ IPFS upload failed:", error.message);
    console.error("\nPlease check:");
    console.error("   - PINATA_API_KEY and PINATA_API_SECRET are set in .env");
    console.error("   - OR PINATA_JWT is set in .env");
    console.error("   - Your Pinata account is active and has sufficient storage");
    process.exit(1);
  }

  // =============================================================================
  // STEP 2: BATCH MINT NFTs WITH METADATA URIs
  // =============================================================================

  console.log("\n⛏️  Step 2: Batch minting NFTs on blockchain...\n");

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log("📝 Minting with account:", signer.address);

  // Get the contract
  const PadelFlowNFTTrophy = await ethers.getContractFactory("PadelFlowNFTTrophy");
  const nftTrophy = PadelFlowNFTTrophy.attach(CONTRACT_ADDRESS);

  console.log("📋 Batch Mint Details:");
  console.log("   - Contract:", CONTRACT_ADDRESS);
  console.log("   - Number of winners:", winners.length);

  // Prepare arrays for batch minting
  const addresses = winners.map(w => w.address);
  const places = winners.map(w => w.place);
  const names = winners.map(w => w.winnerName);

  console.log("\n⏳ Batch minting NFTs...");

  try {
    const tx = await nftTrophy.mintBatch(
      addresses,
      tournament.tournamentId,
      tournament.tournamentName,
      places,
      names,
      metadataUris
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

      console.log("\n📊 Minted Trophies:");
      winners.forEach((winner, idx) => {
        console.log(`   ${idx + 1}. Token #${tokenIds[idx].toString()}`);
        console.log(`      - Winner: ${winner.winnerName}`);
        console.log(`      - Place: ${winner.place}`);
        console.log(`      - Address: ${winner.address}`);
        console.log(`      - Metadata: ${metadataUris[idx]}`);
      });
    }

    // Get total minted count
    const totalMinted = await nftTrophy.totalMinted();
    console.log("\n📊 Total trophies minted:", totalMinted.toString());

    // Get tournament tokens
    const tournamentTokens = await nftTrophy.getTournamentTokens(tournament.tournamentId);
    console.log("📊 Tokens for this tournament:", tournamentTokens.map((id: any) => id.toString()).join(", "));

    // Get network info
    const network = await ethers.provider.getNetwork();
    const explorerUrl = getExplorerUrl(Number(network.chainId), tx.hash);
    if (explorerUrl) {
      console.log("\n🔍 View on Explorer:", explorerUrl);
    }

  } catch (error: any) {
    console.error("\n❌ Batch minting failed:", error.message);
    if (error.message.includes("Recipient already has trophy")) {
      console.error("   Some recipients may have already received trophies for this tournament.");
    }
    process.exit(1);
  }

  console.log("\n✨ Batch minting complete! All NFT Trophies are now on the blockchain with IPFS metadata.");
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
