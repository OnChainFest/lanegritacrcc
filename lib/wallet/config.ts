/**
 * Wallet Configuration
 *
 * This module configures wagmi for wallet connections including:
 * - Coinbase Smart Wallet
 * - MetaMask
 * - WalletConnect
 * - Other EIP-6963 wallets
 */

import { http, createConfig, cookieStorage, createStorage } from 'wagmi';
import { base, baseSepolia, mainnet } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

// Get WalletConnect project ID from environment
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

/**
 * Supported chains for PadelFlow
 */
export const chains = [
  base,          // Base Mainnet (production)
  baseSepolia,   // Base Sepolia (testnet)
  mainnet,       // Ethereum Mainnet (fallback)
] as const;

/**
 * Wagmi configuration
 */
export const config = createConfig({
  chains: [base, baseSepolia, mainnet],
  connectors: [
    // Coinbase Smart Wallet (recommended)
    coinbaseWallet({
      appName: 'PadelFlow',
      appLogoUrl: 'https://padelflow.xyz/logo.png',
      preference: 'smartWalletOnly', // Force Smart Wallet
      version: '4',
    }),

    // Injected wallets (MetaMask, Brave, etc.)
    injected({
      target: 'metaMask',
    }),

    // WalletConnect
    ...(walletConnectProjectId
      ? [
          walletConnect({
            projectId: walletConnectProjectId,
            metadata: {
              name: 'PadelFlow',
              description: 'Web3 Tournament Management Platform',
              url: 'https://padelflow.xyz',
              icons: ['https://padelflow.xyz/logo.png'],
            },
          }),
        ]
      : []),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true, // Enable server-side rendering
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

/**
 * Get chain by ID
 */
export function getChainById(chainId: number) {
  return chains.find((chain) => chain.id === chainId);
}

/**
 * Check if chain is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return chains.some((chain) => chain.id === chainId);
}

/**
 * Get default chain (Base Sepolia for development, Base for production)
 */
export function getDefaultChain() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? baseSepolia : base;
}

/**
 * Format wallet address for display
 * @param address Full wallet address
 * @param chars Number of characters to show at start and end (default: 4)
 * @returns Formatted address (e.g., "0x1234...5678")
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Get block explorer URL for an address
 */
export function getExplorerUrl(chainId: number, address: string): string {
  const explorers: Record<number, string> = {
    [base.id]: `https://basescan.org/address/${address}`,
    [baseSepolia.id]: `https://sepolia.basescan.org/address/${address}`,
    [mainnet.id]: `https://etherscan.io/address/${address}`,
  };
  return explorers[chainId] || '';
}

/**
 * Get block explorer URL for a transaction
 */
export function getTxExplorerUrl(chainId: number, txHash: string): string {
  const explorers: Record<number, string> = {
    [base.id]: `https://basescan.org/tx/${txHash}`,
    [baseSepolia.id]: `https://sepolia.basescan.org/tx/${txHash}`,
    [mainnet.id]: `https://etherscan.io/tx/${txHash}`,
  };
  return explorers[chainId] || '';
}
