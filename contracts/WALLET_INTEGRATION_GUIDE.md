# Wallet Integration Guide

This guide explains how to integrate wallet connectivity into PadelFlow for capturing winner addresses and minting NFT trophies.

## 📋 Overview

The wallet integration enables:
- **Coinbase Smart Wallet** connection (recommended)
- **MetaMask** and other injected wallets
- **WalletConnect** support
- Winner wallet address capture
- Direct NFT minting from the dashboard

## 🚀 Quick Start

### Step 1: Install Dependencies

All required dependencies are already installed:
```bash
✓ wagmi (wallet connections)
✓ viem (Ethereum library)
✓ @coinbase/wallet-sdk (Coinbase Smart Wallet)
✓ @tanstack/react-query (data fetching)
```

### Step 2: Configure WalletConnect (Optional)

If you want to support WalletConnect:

1. Go to [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID
4. Add to `.env.local`:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Step 3: Wrap Your App with WalletProvider

Update your root layout (`app/layout.tsx`):

```tsx
import { WalletProvider } from '@/components/providers/WalletProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
```

### Step 4: Add Wallet Connect Button

In any component:

```tsx
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';

export function Header() {
  return (
    <nav>
      <WalletConnectButton />
    </nav>
  );
}
```

## 🎯 Usage Examples

### Connect Wallet

Users can click the "Connect Wallet" button to choose from:
- **Coinbase Wallet** (Recommended - Smart Wallet)
- **MetaMask**
- **WalletConnect** (if configured)

```tsx
import { useWallet } from '@/lib/wallet/useWallet';

function MyComponent() {
  const { isConnected, address, connectCoinbase, disconnect } = useWallet();

  return (
    <div>
      {!isConnected ? (
        <button onClick={connectCoinbase}>
          Connect Coinbase Wallet
        </button>
      ) : (
        <>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      )}
    </div>
  );
}
```

### Capture Winner Wallet Addresses

Use the `WinnerWalletInput` component:

```tsx
import { WinnerWalletInput } from '@/components/wallet/WinnerWalletInput';

function WinnerForm() {
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <WinnerWalletInput
      value={walletAddress}
      onChange={setWalletAddress}
      label="Winner Wallet Address"
      winnerName="John Doe"
      required
    />
  );
}
```

### Capture Multiple Winners

```tsx
import { WinnersWalletInput } from '@/components/wallet/WinnerWalletInput';

function WinnersForm() {
  const [winners, setWinners] = useState([
    { place: 1, name: 'John Doe', walletAddress: '' },
    { place: 2, name: 'Jane Smith', walletAddress: '' },
    { place: 3, name: 'Bob Johnson', walletAddress: '' },
  ]);

  return (
    <WinnersWalletInput
      winners={winners}
      onChange={setWinners}
    />
  );
}
```

### Mint NFT Trophy with Wallet

```tsx
import { useWalletClient, usePublicClient } from 'wagmi';
import { mintTrophyWithWallet } from '@/lib/wallet/mintTrophy';

function MintButton() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const handleMint = async () => {
    if (!walletClient || !publicClient) return;

    const result = await mintTrophyWithWallet({
      walletClient,
      publicClient,
      recipientAddress: '0x...',
      tournament: {
        tournamentId: 'tournament-123',
        tournamentName: 'PadelFlow Championship',
        tournamentDate: new Date().toISOString(),
        format: 'americano',
        totalPlayers: 32,
      },
      winner: {
        place: 1,
        winnerName: 'John Doe',
      },
      imageSource: null, // Use default image
    });

    if (result.success) {
      console.log('Minted! Token ID:', result.tokenId);
      console.log('Transaction:', result.txHash);
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    <button onClick={handleMint}>
      Mint NFT Trophy
    </button>
  );
}
```

## 🔧 API Reference

### useWallet Hook

```tsx
const {
  // Account
  address,           // Wallet address (0x...)
  isConnected,       // Boolean
  isConnecting,      // Boolean

  // Chain
  chainId,           // Current chain ID
  isOnBase,          // Boolean
  isOnBaseSepolia,   // Boolean
  isOnSupportedChain, // Boolean

  // Actions
  connectCoinbase,   // () => void
  connectMetaMask,   // () => void
  disconnect,        // () => void
  switchToBase,      // () => void
  switchToBaseSepolia, // () => void

  // Connectors
  connectors,        // Array of available connectors
} = useWallet();
```

### WalletConnectButton Props

```tsx
interface WalletConnectButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}
```

### WinnerWalletInput Props

```tsx
interface WinnerWalletInputProps {
  value: string;
  onChange: (address: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  winnerName?: string;
  className?: string;
}
```

### mintTrophyWithWallet

```tsx
interface MintTrophyParams {
  walletClient: WalletClient;
  publicClient: PublicClient;
  recipientAddress: string;
  tournament: TournamentData;
  winner: WinnerData;
  imageSource: string | null;
}

interface MintResult {
  success: boolean;
  tokenId?: string;
  txHash?: string;
  metadataUri?: string;
  error?: string;
}

function mintTrophyWithWallet(params: MintTrophyParams): Promise<MintResult>
```

## 🌐 Supported Chains

- **Base Mainnet** (Chain ID: 8453)
- **Base Sepolia** (Chain ID: 84532)
- **Ethereum Mainnet** (Chain ID: 1) - fallback

## 💡 Best Practices

### 1. Always Validate Addresses

```tsx
import { isAddress } from 'viem';

if (!isAddress(walletAddress)) {
  console.error('Invalid address');
  return;
}
```

### 2. Check Network Before Minting

```tsx
import { useWallet } from '@/lib/wallet/useWallet';

function MintComponent() {
  const { isOnSupportedChain, switchToBase } = useWallet();

  if (!isOnSupportedChain) {
    return (
      <button onClick={switchToBase}>
        Switch to Base Network
      </button>
    );
  }

  return <button onClick={handleMint}>Mint Trophy</button>;
}
```

### 3. Handle Errors Gracefully

```tsx
const result = await mintTrophyWithWallet(params);

if (!result.success) {
  if (result.error?.includes('already has trophy')) {
    alert('Winner already has a trophy for this tournament');
  } else if (result.error?.includes('insufficient funds')) {
    alert('Insufficient funds for gas fees');
  } else {
    alert(`Minting failed: ${result.error}`);
  }
}
```

### 4. Show Transaction Status

```tsx
import { getTxExplorerUrl } from '@/lib/wallet/config';

function TransactionStatus({ txHash, chainId }: { txHash: string; chainId: number }) {
  return (
    <a
      href={getTxExplorerUrl(chainId, txHash)}
      target="_blank"
      rel="noopener noreferrer"
    >
      View transaction on block explorer
    </a>
  );
}
```

## 🔐 Security Considerations

### 1. Never Store Private Keys

❌ **Wrong:**
```tsx
const privateKey = '0x...'; // NEVER DO THIS
```

✅ **Correct:**
```tsx
// Let users connect their own wallets
const { address } = useWallet();
```

### 2. Validate All Inputs

```tsx
// Validate wallet address
if (!isAddress(address)) {
  throw new Error('Invalid wallet address');
}

// Validate tournament data
if (!tournament.tournamentId || !tournament.tournamentName) {
  throw new Error('Invalid tournament data');
}
```

### 3. Check for Duplicates

```tsx
import { hasReceivedTrophy } from '@/lib/wallet/mintTrophy';

const alreadyReceived = await hasReceivedTrophy(
  publicClient,
  chainId,
  recipientAddress,
  tournamentId
);

if (alreadyReceived) {
  alert('Winner already has a trophy for this tournament');
  return;
}
```

### 4. User Confirmation

```tsx
const confirmMint = window.confirm(
  `Mint NFT Trophy for ${winner.name}?\n` +
  `Recipient: ${formatAddress(recipientAddress)}\n` +
  `This action cannot be undone.`
);

if (!confirmMint) return;
```

## 🐛 Troubleshooting

### "User rejected request"

**Problem**: User declined the wallet connection or transaction

**Solution**: This is expected behavior. Show a message to try again.

```tsx
if (error.message.includes('User rejected')) {
  alert('Connection cancelled. Please try again.');
}
```

### "Chain not configured"

**Problem**: User is on an unsupported network

**Solution**: Prompt them to switch networks

```tsx
const { isOnSupportedChain, switchToBase } = useWallet();

if (!isOnSupportedChain) {
  return <button onClick={switchToBase}>Switch to Base Network</button>;
}
```

### "Contract not deployed"

**Problem**: NFT Trophy contract not deployed on the current network

**Solution**: Check contract addresses in `contracts/addresses.json`

```tsx
const contractAddress = getContractAddress(chainId);
if (!contractAddress) {
  return <div>Contract not available on this network</div>;
}
```

### "Insufficient funds for gas"

**Problem**: User's wallet doesn't have enough ETH for gas

**Solution**: Show clear error message

```tsx
if (error.message.includes('insufficient funds')) {
  alert('You need ETH in your wallet to pay for gas fees');
}
```

## 📚 Additional Resources

- [wagmi Documentation](https://wagmi.sh/)
- [Coinbase Smart Wallet Docs](https://docs.cloud.coinbase.com/wallet-sdk/docs)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Base Network Docs](https://docs.base.org/)
- [Viem Documentation](https://viem.sh/)

## 🔮 Next Steps

1. **Test Wallet Connection**: Try connecting with Coinbase Wallet and MetaMask
2. **Capture Winner Addresses**: Use the WinnerWalletInput component
3. **Test Minting**: Mint a test trophy on Base Sepolia testnet
4. **Production Deployment**: Update contract addresses for mainnet
5. **UI Integration**: Add wallet connect button to dashboard

---

**Ready to connect?** Follow the Quick Start guide above and start capturing winner wallet addresses! 🚀
