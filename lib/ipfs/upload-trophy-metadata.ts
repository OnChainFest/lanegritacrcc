/**
 * Trophy Metadata Upload Pipeline
 *
 * This module combines metadata generation and IPFS upload into a single pipeline
 * for minting NFT trophies.
 */

import { uploadJSONToIPFS, uploadImageFromURL, uploadFileToIPFS } from './pinata';
import {
  generateNFTMetadata,
  generateBatchMetadata,
  validateMetadata,
  getDefaultTrophyImage,
  type TournamentData,
  type WinnerData,
  type NFTMetadata
} from './metadata';

export interface UploadResult {
  metadataUri: string;
  metadataHash: string;
  imageUri: string;
  imageHash: string;
  metadata: NFTMetadata;
}

/**
 * Upload complete trophy metadata to IPFS (image + metadata)
 * @param tournament Tournament data
 * @param winner Winner data
 * @param imageSource Image source (URL, file path, or null for default)
 * @param organizerAddress Organizer's wallet address
 * @returns Upload result with IPFS URIs
 */
export async function uploadTrophyMetadata(
  tournament: TournamentData,
  winner: WinnerData,
  imageSource: string | null,
  organizerAddress?: string
): Promise<UploadResult> {
  try {
    console.log(`📤 Uploading trophy metadata for ${winner.winnerName} (${winner.place} place)...`);

    // Step 1: Upload image to IPFS
    let imageUri: string;
    let imageHash: string;

    if (!imageSource) {
      // Use default placeholder image
      console.log('   Using default trophy image...');
      imageUri = getDefaultTrophyImage(winner.place);
      imageHash = 'default';
    } else if (imageSource.startsWith('http')) {
      // Upload image from URL
      console.log('   Uploading image from URL to IPFS...');
      const result = await uploadImageFromURL(
        imageSource,
        `trophy-${tournament.tournamentId}-place-${winner.place}`
      );
      imageUri = result.ipfsUrl;
      imageHash = result.ipfsHash;
      console.log(`   ✅ Image uploaded: ${imageHash}`);
    } else {
      // Upload image from file path
      console.log('   Uploading image file to IPFS...');
      const result = await uploadFileToIPFS(
        imageSource,
        `trophy-${tournament.tournamentId}-place-${winner.place}`
      );
      imageUri = result.ipfsUrl;
      imageHash = result.ipfsHash;
      console.log(`   ✅ Image uploaded: ${imageHash}`);
    }

    // Step 2: Generate metadata
    console.log('   Generating NFT metadata...');
    const metadata = generateNFTMetadata(
      tournament,
      winner,
      imageUri,
      organizerAddress
    );

    // Validate metadata
    validateMetadata(metadata);
    console.log('   ✅ Metadata validated');

    // Step 3: Upload metadata to IPFS
    console.log('   Uploading metadata to IPFS...');
    const metadataResult = await uploadJSONToIPFS(
      metadata,
      `metadata-${tournament.tournamentId}-place-${winner.place}`
    );
    console.log(`   ✅ Metadata uploaded: ${metadataResult.ipfsHash}`);

    console.log(`✅ Upload complete for ${winner.winnerName}`);

    return {
      metadataUri: metadataResult.ipfsUrl,
      metadataHash: metadataResult.ipfsHash,
      imageUri,
      imageHash,
      metadata
    };
  } catch (error: any) {
    console.error(`❌ Failed to upload trophy metadata: ${error.message}`);
    throw error;
  }
}

/**
 * Upload metadata for multiple trophies (batch upload)
 * @param tournament Tournament data
 * @param winners Array of winner data
 * @param imageSources Array of image sources (URLs, file paths, or null)
 * @param organizerAddress Organizer's wallet address
 * @returns Array of upload results
 */
export async function uploadBatchTrophyMetadata(
  tournament: TournamentData,
  winners: WinnerData[],
  imageSources: (string | null)[],
  organizerAddress?: string
): Promise<UploadResult[]> {
  console.log(`\n📤 Uploading metadata for ${winners.length} trophies...`);

  const results: UploadResult[] = [];

  for (let i = 0; i < winners.length; i++) {
    const winner = winners[i];
    const imageSource = imageSources[i] || null;

    try {
      const result = await uploadTrophyMetadata(
        tournament,
        winner,
        imageSource,
        organizerAddress
      );
      results.push(result);

      console.log(`\n✅ ${i + 1}/${winners.length} completed\n`);
    } catch (error: any) {
      console.error(`\n❌ Failed to upload for ${winner.winnerName}: ${error.message}\n`);
      throw error;
    }
  }

  console.log(`\n🎉 All ${winners.length} trophy metadata uploaded successfully!`);
  return results;
}

/**
 * Quick helper to upload trophy with default image
 */
export async function uploadTrophyWithDefaultImage(
  tournamentId: string,
  tournamentName: string,
  tournamentDate: string,
  format: 'americano' | 'round-robin' | 'elimination' | 'league',
  totalPlayers: number,
  place: number,
  winnerName: string,
  organizerAddress?: string
): Promise<UploadResult> {
  const tournament: TournamentData = {
    tournamentId,
    tournamentName,
    tournamentDate,
    format,
    totalPlayers
  };

  const winner: WinnerData = {
    place,
    winnerName
  };

  return uploadTrophyMetadata(tournament, winner, null, organizerAddress);
}

/**
 * Example usage function
 */
export async function exampleUpload() {
  const tournament: TournamentData = {
    tournamentId: 'tournament-123',
    tournamentName: 'PadelFlow Championship 2025',
    tournamentDate: new Date().toISOString(),
    location: 'Miami, FL',
    format: 'americano',
    totalPlayers: 32,
    prizePool: '5000 USDC'
  };

  const winner: WinnerData = {
    place: 1,
    winnerName: 'John Doe',
    partnerName: 'Jane Smith'
  };

  // Upload with default image
  const result = await uploadTrophyMetadata(
    tournament,
    winner,
    null,
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'
  );

  console.log('\nUpload Result:');
  console.log('Metadata URI:', result.metadataUri);
  console.log('Image URI:', result.imageUri);
  console.log('\nMetadata:');
  console.log(JSON.stringify(result.metadata, null, 2));

  return result;
}
