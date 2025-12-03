/**
 * Pinata IPFS Integration
 *
 * This module provides utilities to upload NFT metadata and images to IPFS using Pinata.
 * Pinata is a popular IPFS pinning service that ensures content remains available.
 */

import { readFileSync } from 'fs';

// Pinata API configuration
const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

interface PinataConfig {
  apiKey: string;
  apiSecret: string;
  jwt?: string;
}

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

/**
 * Get Pinata configuration from environment variables
 */
function getPinataConfig(): PinataConfig {
  const apiKey = process.env.PINATA_API_KEY || '';
  const apiSecret = process.env.PINATA_API_SECRET || '';
  const jwt = process.env.PINATA_JWT || '';

  if (!apiKey && !jwt) {
    throw new Error('Pinata API Key or JWT is required. Set PINATA_API_KEY and PINATA_API_SECRET or PINATA_JWT in .env');
  }

  return { apiKey, apiSecret, jwt };
}

/**
 * Get authorization headers for Pinata API
 */
function getAuthHeaders(config: PinataConfig): HeadersInit {
  if (config.jwt) {
    return {
      'Authorization': `Bearer ${config.jwt}`
    };
  }
  return {
    'pinata_api_key': config.apiKey,
    'pinata_secret_api_key': config.apiSecret
  };
}

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param metadata JSON metadata object
 * @param name Optional name for the pinned content
 * @returns IPFS hash (CID)
 */
export async function uploadJSONToIPFS(
  metadata: any,
  name?: string
): Promise<{ ipfsHash: string; ipfsUrl: string }> {
  try {
    const config = getPinataConfig();

    const data = {
      pinataContent: metadata,
      pinataMetadata: {
        name: name || `PadelFlow-NFT-${Date.now()}`
      }
    };

    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(config),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata API error: ${response.status} - ${errorText}`);
    }

    const result: PinataResponse = await response.json();

    return {
      ipfsHash: result.IpfsHash,
      ipfsUrl: `ipfs://${result.IpfsHash}`
    };
  } catch (error: any) {
    console.error('Error uploading JSON to IPFS:', error);
    throw new Error(`Failed to upload JSON to IPFS: ${error.message}`);
  }
}

/**
 * Upload a file to IPFS via Pinata
 * @param filePath Path to the file
 * @param name Optional name for the pinned content
 * @returns IPFS hash (CID)
 */
export async function uploadFileToIPFS(
  filePath: string,
  name?: string
): Promise<{ ipfsHash: string; ipfsUrl: string }> {
  try {
    const config = getPinataConfig();

    // Read file
    const fileBuffer = readFileSync(filePath);
    const blob = new Blob([fileBuffer]);

    // Create form data
    const formData = new FormData();
    formData.append('file', blob, name || filePath.split('/').pop());

    const metadata = JSON.stringify({
      name: name || `PadelFlow-Image-${Date.now()}`
    });
    formData.append('pinataMetadata', metadata);

    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: getAuthHeaders(config),
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata API error: ${response.status} - ${errorText}`);
    }

    const result: PinataResponse = await response.json();

    return {
      ipfsHash: result.IpfsHash,
      ipfsUrl: `ipfs://${result.IpfsHash}`
    };
  } catch (error: any) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error(`Failed to upload file to IPFS: ${error.message}`);
  }
}

/**
 * Upload image from URL to IPFS
 * @param imageUrl URL of the image
 * @param name Optional name for the pinned content
 * @returns IPFS hash (CID)
 */
export async function uploadImageFromURL(
  imageUrl: string,
  name?: string
): Promise<{ ipfsHash: string; ipfsUrl: string }> {
  try {
    const config = getPinataConfig();

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image from ${imageUrl}`);
    }

    const imageBlob = await imageResponse.blob();

    // Create form data
    const formData = new FormData();
    formData.append('file', imageBlob, name || `image-${Date.now()}.png`);

    const metadata = JSON.stringify({
      name: name || `PadelFlow-Trophy-Image-${Date.now()}`
    });
    formData.append('pinataMetadata', metadata);

    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: getAuthHeaders(config),
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata API error: ${response.status} - ${errorText}`);
    }

    const result: PinataResponse = await response.json();

    return {
      ipfsHash: result.IpfsHash,
      ipfsUrl: `ipfs://${result.IpfsHash}`
    };
  } catch (error: any) {
    console.error('Error uploading image from URL to IPFS:', error);
    throw new Error(`Failed to upload image to IPFS: ${error.message}`);
  }
}

/**
 * Get the HTTP gateway URL for an IPFS hash
 * @param ipfsHash IPFS hash (CID)
 * @returns HTTP URL via Pinata gateway
 */
export function getIPFSGatewayURL(ipfsHash: string): string {
  // Remove ipfs:// prefix if present
  const hash = ipfsHash.replace('ipfs://', '');
  return `${PINATA_GATEWAY}${hash}`;
}

/**
 * Test Pinata connection
 */
export async function testPinataConnection(): Promise<boolean> {
  try {
    const config = getPinataConfig();

    const response = await fetch(`${PINATA_API_URL}/data/testAuthentication`, {
      method: 'GET',
      headers: getAuthHeaders(config)
    });

    return response.ok;
  } catch (error) {
    console.error('Pinata connection test failed:', error);
    return false;
  }
}

/**
 * Unpin (delete) content from IPFS
 * @param ipfsHash IPFS hash to unpin
 */
export async function unpinFromIPFS(ipfsHash: string): Promise<boolean> {
  try {
    const config = getPinataConfig();

    const response = await fetch(`${PINATA_API_URL}/pinning/unpin/${ipfsHash}`, {
      method: 'DELETE',
      headers: getAuthHeaders(config)
    });

    return response.ok;
  } catch (error: any) {
    console.error('Error unpinning from IPFS:', error);
    return false;
  }
}

/**
 * List all pinned content
 */
export async function listPinnedContent(): Promise<any[]> {
  try {
    const config = getPinataConfig();

    const response = await fetch(`${PINATA_API_URL}/data/pinList?status=pinned`, {
      method: 'GET',
      headers: getAuthHeaders(config)
    });

    if (!response.ok) {
      throw new Error('Failed to list pinned content');
    }

    const result = await response.json();
    return result.rows || [];
  } catch (error: any) {
    console.error('Error listing pinned content:', error);
    return [];
  }
}
