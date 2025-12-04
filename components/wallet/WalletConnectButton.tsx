'use client';

/**
 * Wallet Connect Button Component
 *
 * A button component that allows users to connect/disconnect their wallets.
 * Supports Coinbase Smart Wallet, MetaMask, and WalletConnect.
 */

import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet, LogOut, ExternalLink, Copy, Check } from 'lucide-react';
import { formatAddress, getExplorerUrl } from '@/lib/wallet/config';
import { useState } from 'react';

interface WalletConnectButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function WalletConnectButton({
  variant = 'default',
  size = 'default',
  className = '',
}: WalletConnectButtonProps) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const [copied, setCopied] = useState(false);

  // Handle copy address
  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If not connected, show connect menu
  if (!isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={className}
            disabled={isPending}
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isPending ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Select Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {connectors.map((connector) => (
            <DropdownMenuItem
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={!connector.ready || isPending}
              className="cursor-pointer"
            >
              {getConnectorIcon(connector.name)}
              <span className="ml-2">{connector.name}</span>
              {connector.name === 'Coinbase Wallet' && (
                <span className="ml-auto text-xs text-primary">Recommended</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If connected, show account menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Wallet className="w-4 h-4 mr-2" />
          {ensName || formatAddress(address!)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">
              {ensName || formatAddress(address!, 6)}
            </span>
            {chain && (
              <span className="text-xs text-muted-foreground">
                Connected to {chain.name}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy Address'}
        </DropdownMenuItem>

        {chain && (
          <DropdownMenuItem
            onClick={() => {
              const url = getExplorerUrl(chain.id, address!);
              if (url) window.open(url, '_blank');
            }}
            className="cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => disconnect()}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Get icon for connector
 */
function getConnectorIcon(connectorName: string) {
  // You can add custom icons here
  return <Wallet className="w-4 h-4" />;
}
