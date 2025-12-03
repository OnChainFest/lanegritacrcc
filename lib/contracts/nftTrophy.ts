/**
 * NFT Trophy Contract Integration
 *
 * This module provides utilities to interact with the PadelFlowNFTTrophy smart contract
 * from the frontend application.
 */

import { ethers } from 'ethers';
import contractAddresses from '@/contracts/addresses.json';

// Contract ABI (simplified - only the functions we need)
const NFT_TROPHY_ABI = [
  // Read functions
  "function totalMinted() view returns (uint256)",
  "function getTournamentTokens(string tournamentId) view returns (uint256[])",
  "function getTournamentInfo(uint256 tokenId) view returns (tuple(string tournamentId, string tournamentName, uint256 place, string winnerName, uint256 timestamp, string metadataURI))",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function hasReceivedTrophy(address recipient, string tournamentId) view returns (bool)",

  // Write functions
  "function mint(address recipient, string tournamentId, string tournamentName, uint256 place, string winnerName, string metadataURI) returns (uint256)",
  "function mintBatch(address[] recipients, string tournamentId, string tournamentName, uint256[] places, string[] winnerNames, string[] metadataURIs) returns (uint256[])",

  // Events
  "event TrophyMinted(uint256 indexed tokenId, address indexed recipient, string tournamentId, string tournamentName, uint256 place, string winnerName)",
  "event TrophyBatchMinted(string indexed tournamentId, uint256[] tokenIds, address[] recipients)"
];

export interface TournamentInfo {
  tournamentId: string;
  tournamentName: string;
  place: number;
  winnerName: string;
  timestamp: number;
  metadataURI: string;
}

export interface WinnerData {
  address: string;
  place: number;
  name: string;
  metadataURI: string;
}

/**
 * Get the NFT Trophy contract address for the current network
 */
export function getContractAddress(chainId: number): string | null {
  const network = Object.values(contractAddresses.networks).find(
    (net: any) => net.chainId === chainId
  );
  return network?.contracts.PadelFlowNFTTrophy.address || null;
}

/**
 * Get the NFT Trophy contract instance
 * @param provider Ethers provider or signer
 * @param chainId Network chain ID
 */
export function getNFTTrophyContract(
  provider: ethers.Provider | ethers.Signer,
  chainId: number
): ethers.Contract | null {
  const address = getContractAddress(chainId);
  if (!address) {
    console.error(`No contract address found for chain ID ${chainId}`);
    return null;
  }
  return new ethers.Contract(address, NFT_TROPHY_ABI, provider);
}

/**
 * Mint a single NFT Trophy to a winner
 * @param signer Ethers signer (wallet)
 * @param chainId Network chain ID
 * @param recipient Winner's wallet address
 * @param tournamentId PadelFlow tournament ID
 * @param tournamentName Tournament name
 * @param place Winner's place (1, 2, 3, etc.)
 * @param winnerName Winner's display name
 * @param metadataURI IPFS or HTTP URI for NFT metadata
 */
export async function mintNFTTrophy(
  signer: ethers.Signer,
  chainId: number,
  recipient: string,
  tournamentId: string,
  tournamentName: string,
  place: number,
  winnerName: string,
  metadataURI: string
): Promise<{ success: boolean; tokenId?: string; txHash?: string; error?: string }> {
  try {
    const contract = getNFTTrophyContract(signer, chainId);
    if (!contract) {
      return { success: false, error: 'Contract not found for this network' };
    }

    // Check if recipient already has a trophy for this tournament
    const hasTrophy = await contract.hasReceivedTrophy(recipient, tournamentId);
    if (hasTrophy) {
      return { success: false, error: 'Recipient already has a trophy for this tournament' };
    }

    // Mint the NFT
    const tx = await contract.mint(
      recipient,
      tournamentId,
      tournamentName,
      place,
      winnerName,
      metadataURI
    );

    // Wait for confirmation
    const receipt = await tx.wait();

    // Extract token ID from event
    const event = receipt.logs.find((log: any) => {
      try {
        const parsedLog = contract.interface.parseLog(log);
        return parsedLog?.name === 'TrophyMinted';
      } catch {
        return false;
      }
    });

    let tokenId = '0';
    if (event) {
      const parsedEvent = contract.interface.parseLog(event);
      tokenId = parsedEvent?.args[0].toString();
    }

    return {
      success: true,
      tokenId,
      txHash: receipt.hash
    };
  } catch (error: any) {
    console.error('Error minting NFT Trophy:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Batch mint NFT Trophies for multiple winners
 * @param signer Ethers signer (wallet)
 * @param chainId Network chain ID
 * @param tournamentId PadelFlow tournament ID
 * @param tournamentName Tournament name
 * @param winners Array of winner data
 */
export async function mintNFTTrophyBatch(
  signer: ethers.Signer,
  chainId: number,
  tournamentId: string,
  tournamentName: string,
  winners: WinnerData[]
): Promise<{ success: boolean; tokenIds?: string[]; txHash?: string; error?: string }> {
  try {
    const contract = getNFTTrophyContract(signer, chainId);
    if (!contract) {
      return { success: false, error: 'Contract not found for this network' };
    }

    // Check for duplicates
    for (const winner of winners) {
      const hasTrophy = await contract.hasReceivedTrophy(winner.address, tournamentId);
      if (hasTrophy) {
        return {
          success: false,
          error: `Recipient ${winner.address} already has a trophy for this tournament`
        };
      }
    }

    // Prepare arrays
    const addresses = winners.map(w => w.address);
    const places = winners.map(w => w.place);
    const names = winners.map(w => w.name);
    const metadataURIs = winners.map(w => w.metadataURI);

    // Mint the NFTs
    const tx = await contract.mintBatch(
      addresses,
      tournamentId,
      tournamentName,
      places,
      names,
      metadataURIs
    );

    // Wait for confirmation
    const receipt = await tx.wait();

    // Extract token IDs from event
    const batchEvent = receipt.logs.find((log: any) => {
      try {
        const parsedLog = contract.interface.parseLog(log);
        return parsedLog?.name === 'TrophyBatchMinted';
      } catch {
        return false;
      }
    });

    let tokenIds: string[] = [];
    if (batchEvent) {
      const parsedEvent = contract.interface.parseLog(batchEvent);
      tokenIds = parsedEvent?.args[1].map((id: any) => id.toString());
    }

    return {
      success: true,
      tokenIds,
      txHash: receipt.hash
    };
  } catch (error: any) {
    console.error('Error batch minting NFT Trophies:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Get tournament information for a token
 * @param provider Ethers provider
 * @param chainId Network chain ID
 * @param tokenId Token ID
 */
export async function getTournamentInfo(
  provider: ethers.Provider,
  chainId: number,
  tokenId: string
): Promise<TournamentInfo | null> {
  try {
    const contract = getNFTTrophyContract(provider, chainId);
    if (!contract) return null;

    const info = await contract.getTournamentInfo(tokenId);
    return {
      tournamentId: info.tournamentId,
      tournamentName: info.tournamentName,
      place: Number(info.place),
      winnerName: info.winnerName,
      timestamp: Number(info.timestamp),
      metadataURI: info.metadataURI
    };
  } catch (error) {
    console.error('Error getting tournament info:', error);
    return null;
  }
}

/**
 * Get all token IDs for a tournament
 * @param provider Ethers provider
 * @param chainId Network chain ID
 * @param tournamentId Tournament ID
 */
export async function getTournamentTokens(
  provider: ethers.Provider,
  chainId: number,
  tournamentId: string
): Promise<string[]> {
  try {
    const contract = getNFTTrophyContract(provider, chainId);
    if (!contract) return [];

    const tokens = await contract.getTournamentTokens(tournamentId);
    return tokens.map((id: any) => id.toString());
  } catch (error) {
    console.error('Error getting tournament tokens:', error);
    return [];
  }
}

/**
 * Get total number of minted trophies
 * @param provider Ethers provider
 * @param chainId Network chain ID
 */
export async function getTotalMinted(
  provider: ethers.Provider,
  chainId: number
): Promise<number> {
  try {
    const contract = getNFTTrophyContract(provider, chainId);
    if (!contract) return 0;

    const total = await contract.totalMinted();
    return Number(total);
  } catch (error) {
    console.error('Error getting total minted:', error);
    return 0;
  }
}

// TODO: Web3 Integration Hooks
// These placeholders can be replaced with actual wallet connection logic when integrating with the dashboard

/**
 * TODO: Connect wallet and get signer
 * This should be implemented when integrating with Coinbase Smart Wallet or other wallet providers
 */
export async function connectWalletAndGetSigner(): Promise<ethers.Signer | null> {
  // Placeholder for wallet connection
  // In production, this would:
  // 1. Connect to Coinbase Smart Wallet SDK
  // 2. Request wallet connection
  // 3. Return an ethers.Signer instance
  console.log('🔜 TODO: Implement wallet connection');
  return null;
}

/**
 * TODO: Get current network chain ID
 * This should be implemented to detect the current blockchain network
 */
export async function getCurrentChainId(): Promise<number | null> {
  // Placeholder for network detection
  // In production, this would:
  // 1. Check connected wallet's network
  // 2. Return the chain ID
  console.log('🔜 TODO: Implement network detection');
  return null;
}
