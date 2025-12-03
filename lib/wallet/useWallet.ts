/**
 * useWallet Hook
 *
 * Custom hook that provides wallet functionality with simplified API
 */

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { useCallback } from 'react';

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  /**
   * Connect to Coinbase Smart Wallet
   */
  const connectCoinbase = useCallback(() => {
    const coinbaseConnector = connectors.find(
      (c) => c.name === 'Coinbase Wallet'
    );
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector });
    }
  }, [connect, connectors]);

  /**
   * Connect to MetaMask
   */
  const connectMetaMask = useCallback(() => {
    const metaMaskConnector = connectors.find((c) => c.name === 'MetaMask');
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  }, [connect, connectors]);

  /**
   * Switch to Base Sepolia (testnet)
   */
  const switchToBaseSepolia = useCallback(() => {
    switchChain({ chainId: baseSepolia.id });
  }, [switchChain]);

  /**
   * Switch to Base Mainnet
   */
  const switchToBase = useCallback(() => {
    switchChain({ chainId: base.id });
  }, [switchChain]);

  /**
   * Check if on correct network
   */
  const isOnBase = chainId === base.id;
  const isOnBaseSepolia = chainId === baseSepolia.id;
  const isOnSupportedChain = isOnBase || isOnBaseSepolia;

  return {
    // Account state
    address,
    isConnected,
    isConnecting,

    // Chain state
    chainId,
    isOnBase,
    isOnBaseSepolia,
    isOnSupportedChain,

    // Connection actions
    connectCoinbase,
    connectMetaMask,
    disconnect,

    // Chain switching
    switchToBase,
    switchToBaseSepolia,

    // Available connectors
    connectors,
  };
}
