/**
 * Trophy Minting with Wallet Integration
 *
 * This module integrates wallet connection with NFT Trophy minting,
 * allowing users to mint trophies directly from the frontend.
 */

import { getContract, type WalletClient, type PublicClient } from 'viem';
import { uploadTrophyMetadata, uploadBatchTrophyMetadata } from '@/lib/ipfs/upload-trophy-metadata';
import type { TournamentData, WinnerData } from '@/lib/ipfs/metadata';
import { getContractAddress } from '@/lib/contracts/nftTrophy';

// Contract ABI - only the functions we need
const NFT_TROPHY_ABI = [
  {
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'tournamentId', type: 'string' },
      { name: 'tournamentName', type: 'string' },
      { name: 'place', type: 'uint256' },
      { name: 'winnerName', type: 'string' },
      { name: 'metadataURI', type: 'string' },
    ],
    name: 'mint',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'recipients', type: 'address[]' },
      { name: 'tournamentId', type: 'string' },
      { name: 'tournamentName', type: 'string' },
      { name: 'places', type: 'uint256[]' },
      { name: 'winnerNames', type: 'string[]' },
      { name: 'metadataURIs', type: 'string[]' },
    ],
    name: 'mintBatch',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export interface MintTrophyParams {
  walletClient: WalletClient;
  publicClient: PublicClient;
  recipientAddress: string;
  tournament: TournamentData;
  winner: WinnerData;
  imageSource: string | null;
}

export interface MintBatchTrophyParams {
  walletClient: WalletClient;
  publicClient: PublicClient;
  recipients: string[];
  tournament: TournamentData;
  winners: WinnerData[];
  imageSources: (string | null)[];
}

export interface MintResult {
  success: boolean;
  tokenId?: string;
  txHash?: string;
  metadataUri?: string;
  error?: string;
}

export interface MintBatchResult {
  success: boolean;
  tokenIds?: string[];
  txHash?: string;
  metadataUris?: string[];
  error?: string;
}

/**
 * Mint a single NFT Trophy
 */
export async function mintTrophyWithWallet(
  params: MintTrophyParams
): Promise<MintResult> {
  const {
    walletClient,
    publicClient,
    recipientAddress,
    tournament,
    winner,
    imageSource,
  } = params;

  try {
    // Get chain ID
    const chainId = await walletClient.getChainId();

    // Get contract address
    const contractAddress = getContractAddress(chainId);
    if (!contractAddress) {
      return {
        success: false,
        error: `No NFT Trophy contract deployed on chain ${chainId}`,
      };
    }

    // Get the organizer address (connected wallet)
    const [organizerAddress] = await walletClient.getAddresses();

    // Step 1: Upload metadata to IPFS
    console.log('📤 Uploading trophy metadata to IPFS...');
    const uploadResult = await uploadTrophyMetadata(
      tournament,
      winner,
      imageSource,
      organizerAddress
    );
    console.log('✅ Metadata uploaded:', uploadResult.metadataUri);

    // Step 2: Get contract instance
    const contract = getContract({
      address: contractAddress as `0x${string}`,
      abi: NFT_TROPHY_ABI,
      client: { public: publicClient, wallet: walletClient },
    });

    // Step 3: Mint the NFT
    console.log('⛏️  Minting NFT Trophy...');
    const txHash = await contract.write.mint([
      recipientAddress as `0x${string}`,
      tournament.tournamentId,
      tournament.tournamentName,
      BigInt(winner.place),
      winner.winnerName,
      uploadResult.metadataUri,
    ]);

    console.log('📤 Transaction sent:', txHash);

    // Step 4: Wait for transaction confirmation
    console.log('⏳ Waiting for confirmation...');
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    console.log('✅ Transaction confirmed!');

    // Extract token ID from logs (simplified - you'd parse the event properly)
    const tokenId = '0'; // TODO: Parse from event logs

    return {
      success: true,
      tokenId,
      txHash,
      metadataUri: uploadResult.metadataUri,
    };
  } catch (error: any) {
    console.error('❌ Minting failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}

/**
 * Mint multiple NFT Trophies (batch)
 */
export async function mintBatchTrophiesWithWallet(
  params: MintBatchTrophyParams
): Promise<MintBatchResult> {
  const {
    walletClient,
    publicClient,
    recipients,
    tournament,
    winners,
    imageSources,
  } = params;

  try {
    // Get chain ID
    const chainId = await walletClient.getChainId();

    // Get contract address
    const contractAddress = getContractAddress(chainId);
    if (!contractAddress) {
      return {
        success: false,
        error: `No NFT Trophy contract deployed on chain ${chainId}`,
      };
    }

    // Get the organizer address (connected wallet)
    const [organizerAddress] = await walletClient.getAddresses();

    // Step 1: Upload all metadata to IPFS
    console.log('📤 Uploading batch trophy metadata to IPFS...');
    const uploadResults = await uploadBatchTrophyMetadata(
      tournament,
      winners,
      imageSources,
      organizerAddress
    );
    const metadataUris = uploadResults.map((r) => r.metadataUri);
    console.log('✅ All metadata uploaded');

    // Step 2: Get contract instance
    const contract = getContract({
      address: contractAddress as `0x${string}`,
      abi: NFT_TROPHY_ABI,
      client: { public: publicClient, wallet: walletClient },
    });

    // Step 3: Prepare batch mint parameters
    const recipientAddresses = recipients.map((addr) => addr as `0x${string}`);
    const places = winners.map((w) => BigInt(w.place));
    const names = winners.map((w) => w.winnerName);

    // Step 4: Batch mint NFTs
    console.log('⛏️  Batch minting NFT Trophies...');
    const txHash = await contract.write.mintBatch([
      recipientAddresses,
      tournament.tournamentId,
      tournament.tournamentName,
      places,
      names,
      metadataUris,
    ]);

    console.log('📤 Transaction sent:', txHash);

    // Step 5: Wait for transaction confirmation
    console.log('⏳ Waiting for confirmation...');
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    console.log('✅ Transaction confirmed!');

    // Extract token IDs from logs (simplified)
    const tokenIds = winners.map((_, i) => i.toString()); // TODO: Parse from event logs

    return {
      success: true,
      tokenIds,
      txHash,
      metadataUris,
    };
  } catch (error: any) {
    console.error('❌ Batch minting failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}

/**
 * Check if user has already received a trophy for this tournament
 */
export async function hasReceivedTrophy(
  publicClient: PublicClient,
  chainId: number,
  recipientAddress: string,
  tournamentId: string
): Promise<boolean> {
  try {
    const contractAddress = getContractAddress(chainId);
    if (!contractAddress) return false;

    const contract = getContract({
      address: contractAddress as `0x${string}`,
      abi: [
        {
          inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'tournamentId', type: 'string' },
          ],
          name: 'hasReceivedTrophy',
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'view',
          type: 'function',
        },
      ] as const,
      client: publicClient,
    });

    const result = await contract.read.hasReceivedTrophy([
      recipientAddress as `0x${string}`,
      tournamentId,
    ]);

    return result as boolean;
  } catch (error) {
    console.error('Error checking trophy status:', error);
    return false;
  }
}
