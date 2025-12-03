/**
 * NFT Metadata Generator
 *
 * This module generates ERC-721 compliant metadata for PadelFlow NFT Trophies.
 * Follows the OpenSea metadata standards: https://docs.opensea.io/docs/metadata-standards
 */

export interface TournamentData {
  tournamentId: string;
  tournamentName: string;
  tournamentDate: string;
  location?: string;
  format: 'americano' | 'round-robin' | 'elimination' | 'league';
  totalPlayers: number;
  prizePool?: string;
}

export interface WinnerData {
  place: number;
  winnerName: string;
  partnerName?: string; // For doubles tournaments
  finalScore?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_number' | 'boost_percentage' | 'date';
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: NFTAttribute[];
  properties?: {
    category: string;
    creators: Array<{
      address: string;
      share: number;
    }>;
  };
}

/**
 * Generate a place suffix (1st, 2nd, 3rd, etc.)
 */
function getPlaceSuffix(place: number): string {
  if (place === 1) return '1st';
  if (place === 2) return '2nd';
  if (place === 3) return '3rd';
  return `${place}th`;
}

/**
 * Get a rarity level based on place
 */
function getRarity(place: number): string {
  if (place === 1) return 'Legendary';
  if (place === 2) return 'Epic';
  if (place === 3) return 'Rare';
  return 'Common';
}

/**
 * Get trophy emoji based on place
 */
function getTrophyEmoji(place: number): string {
  if (place === 1) return '🥇';
  if (place === 2) return '🥈';
  if (place === 3) return '🥉';
  return '🏆';
}

/**
 * Generate NFT metadata for a tournament winner
 * @param tournament Tournament data
 * @param winner Winner data
 * @param imageUrl IPFS URL or HTTP URL of the trophy image
 * @param organizerAddress Organizer's wallet address
 * @returns NFT metadata object
 */
export function generateNFTMetadata(
  tournament: TournamentData,
  winner: WinnerData,
  imageUrl: string,
  organizerAddress?: string
): NFTMetadata {
  const placeText = getPlaceSuffix(winner.place);
  const trophyEmoji = getTrophyEmoji(winner.place);
  const rarity = getRarity(winner.place);

  // Generate name
  const name = `${trophyEmoji} ${tournament.tournamentName} - ${placeText} Place`;

  // Generate description
  let description = `This NFT Trophy commemorates ${winner.winnerName}'s ${placeText} place finish in ${tournament.tournamentName}.`;

  if (winner.partnerName) {
    description += ` Partnered with ${winner.partnerName}.`;
  }

  description += `\n\nTournament Format: ${tournament.format.charAt(0).toUpperCase() + tournament.format.slice(1)}`;
  description += `\nTotal Players: ${tournament.totalPlayers}`;

  if (tournament.location) {
    description += `\nLocation: ${tournament.location}`;
  }

  if (winner.finalScore) {
    description += `\nFinal Score: ${winner.finalScore}`;
  }

  description += '\n\nPowered by PadelFlow - Web3 Tournament Management';

  // Generate attributes
  const attributes: NFTAttribute[] = [
    {
      trait_type: 'Tournament',
      value: tournament.tournamentName
    },
    {
      trait_type: 'Place',
      value: winner.place,
      display_type: 'number'
    },
    {
      trait_type: 'Rarity',
      value: rarity
    },
    {
      trait_type: 'Winner',
      value: winner.winnerName
    },
    {
      trait_type: 'Format',
      value: tournament.format.charAt(0).toUpperCase() + tournament.format.slice(1)
    },
    {
      trait_type: 'Total Players',
      value: tournament.totalPlayers,
      display_type: 'number'
    },
    {
      trait_type: 'Tournament Date',
      value: new Date(tournament.tournamentDate).getTime() / 1000,
      display_type: 'date'
    }
  ];

  // Add optional attributes
  if (tournament.location) {
    attributes.push({
      trait_type: 'Location',
      value: tournament.location
    });
  }

  if (tournament.prizePool) {
    attributes.push({
      trait_type: 'Prize Pool',
      value: tournament.prizePool
    });
  }

  if (winner.partnerName) {
    attributes.push({
      trait_type: 'Partner',
      value: winner.partnerName
    });
  }

  if (winner.finalScore) {
    attributes.push({
      trait_type: 'Final Score',
      value: winner.finalScore
    });
  }

  // Construct metadata
  const metadata: NFTMetadata = {
    name,
    description,
    image: imageUrl,
    external_url: `https://padelflow.xyz/tournaments/${tournament.tournamentId}`,
    attributes
  };

  // Add properties for creator royalties (if organizer address provided)
  if (organizerAddress) {
    metadata.properties = {
      category: 'trophy',
      creators: [
        {
          address: organizerAddress,
          share: 100
        }
      ]
    };
  }

  return metadata;
}

/**
 * Generate batch metadata for multiple winners
 * @param tournament Tournament data
 * @param winners Array of winner data
 * @param imageUrls Array of IPFS URLs (one per winner, or single URL for all)
 * @param organizerAddress Organizer's wallet address
 * @returns Array of NFT metadata objects
 */
export function generateBatchMetadata(
  tournament: TournamentData,
  winners: WinnerData[],
  imageUrls: string[] | string,
  organizerAddress?: string
): NFTMetadata[] {
  return winners.map((winner, index) => {
    const imageUrl = Array.isArray(imageUrls) ? imageUrls[index] : imageUrls;
    return generateNFTMetadata(tournament, winner, imageUrl, organizerAddress);
  });
}

/**
 * Validate NFT metadata according to ERC-721 standard
 * @param metadata NFT metadata object
 * @returns true if valid, throws error if invalid
 */
export function validateMetadata(metadata: NFTMetadata): boolean {
  if (!metadata.name || metadata.name.trim() === '') {
    throw new Error('Metadata must have a name');
  }

  if (!metadata.description || metadata.description.trim() === '') {
    throw new Error('Metadata must have a description');
  }

  if (!metadata.image || metadata.image.trim() === '') {
    throw new Error('Metadata must have an image');
  }

  if (!Array.isArray(metadata.attributes)) {
    throw new Error('Metadata must have attributes array');
  }

  // Validate attributes
  metadata.attributes.forEach((attr, index) => {
    if (!attr.trait_type || !attr.value) {
      throw new Error(`Attribute at index ${index} is missing trait_type or value`);
    }
  });

  return true;
}

/**
 * Create a default trophy image URL (placeholder)
 * In production, this should be replaced with actual trophy images
 */
export function getDefaultTrophyImage(place: number): string {
  const colors = ['gold', 'silver', 'bronze', 'blue'];
  const color = colors[Math.min(place - 1, colors.length - 1)];

  // This is a placeholder - in production, you'd have actual trophy images
  // For now, returning a placeholder that can be replaced with real images
  return `https://placehold.co/600x600/${color}/white?text=${getPlaceSuffix(place)}+Place+Trophy`;
}

/**
 * Example: Generate sample metadata
 */
export function generateSampleMetadata(): NFTMetadata {
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
    partnerName: 'Jane Smith',
    finalScore: '6-4, 6-3'
  };

  return generateNFTMetadata(
    tournament,
    winner,
    getDefaultTrophyImage(1),
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'
  );
}
