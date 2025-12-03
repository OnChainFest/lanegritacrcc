# PadelFlow NFT Trophy Smart Contracts

This directory contains the smart contracts for PadelFlow's NFT Trophy system, which allows tournament organizers to mint commemorative NFT trophies for tournament winners.

## 📋 Overview

The `PadelFlowNFTTrophy` contract is an ERC-721 NFT contract that enables:
- Minting NFT trophies for tournament winners
- Storing tournament metadata on-chain
- Batch minting for multiple winners
- Prevention of duplicate trophies per tournament
- Owner-controlled minting (organizer only)
- Pausable functionality for emergencies

## 🏗️ Contract Architecture

### PadelFlowNFTTrophy.sol

Main features:
- **ERC-721 Standard**: Standard NFT implementation with URI storage
- **Owner Access Control**: Only the contract owner (tournament organizer) can mint
- **Tournament Tracking**: Each token stores tournament ID, name, place, and winner info
- **Duplicate Prevention**: Prevents the same wallet from receiving multiple trophies for the same tournament
- **Batch Minting**: Efficiently mint multiple trophies in a single transaction
- **Pausable**: Emergency pause functionality for security

### Key Functions

#### `mint()`
```solidity
function mint(
    address recipient,
    string memory tournamentId,
    string memory tournamentName,
    uint256 place,
    string memory winnerName,
    string memory metadataURI
) public onlyOwner whenNotPaused returns (uint256)
```

Mints a single NFT trophy to a winner.

#### `mintBatch()`
```solidity
function mintBatch(
    address[] memory recipients,
    string memory tournamentId,
    string memory tournamentName,
    uint256[] memory places,
    string[] memory winnerNames,
    string[] memory metadataURIs
) public onlyOwner whenNotPaused returns (uint256[] memory)
```

Batch mints multiple NFT trophies for a tournament.

#### `getTournamentInfo()`
```solidity
function getTournamentInfo(uint256 tokenId)
    public view returns (TournamentInfo memory)
```

Returns tournament information for a specific token.

## 🚀 Deployment

### Prerequisites

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Set up environment variables in `.env`:
```bash
# Deployer private key (keep this secret!)
PRIVATE_KEY=your_private_key_here

# Network RPC URLs
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
XRPL_EVM_RPC_URL=https://rpc-evm-sidechain.xrpl.org

# Block explorer API keys (for contract verification)
BASESCAN_API_KEY=your_basescan_api_key
```

### Deploy to Testnet (Base Sepolia)

```bash
npx hardhat run scripts/deploy/deploy-nft-trophy.ts --network baseSepolia
```

### Deploy to Mainnet (Base)

```bash
npx hardhat run scripts/deploy/deploy-nft-trophy.ts --network base
```

### Deploy to XRPL EVM

```bash
npx hardhat run scripts/deploy/deploy-nft-trophy.ts --network xrplEvm
```

### Verify Contract

After deployment, verify the contract on the block explorer:

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> <DEPLOYER_ADDRESS>
```

## 🎯 Usage

### Mint Single Trophy

```bash
# Set environment variables
export NFT_TROPHY_CONTRACT_ADDRESS=0x...
export RECIPIENT_ADDRESS=0x...
export TOURNAMENT_ID=tournament-123
export TOURNAMENT_NAME="PadelFlow Championship 2025"
export PLACE=1
export WINNER_NAME="John Doe"
export METADATA_URI=ipfs://QmExample...

# Run mint script
npx hardhat run scripts/deploy/mint-trophy.ts --network baseSepolia
```

### Batch Mint Trophies

Edit `scripts/deploy/mint-trophy-batch.ts` to update the winners array, then:

```bash
export NFT_TROPHY_CONTRACT_ADDRESS=0x...
export TOURNAMENT_ID=tournament-123
export TOURNAMENT_NAME="PadelFlow Championship 2025"

npx hardhat run scripts/deploy/mint-trophy-batch.ts --network baseSepolia
```

## 📝 Frontend Integration

The contract can be integrated into the PadelFlow dashboard using the utility functions in `lib/contracts/nftTrophy.ts`:

```typescript
import { mintNFTTrophy, mintNFTTrophyBatch } from '@/lib/contracts/nftTrophy';

// Mint single trophy
const result = await mintNFTTrophy(
  signer,
  chainId,
  recipientAddress,
  tournamentId,
  tournamentName,
  place,
  winnerName,
  metadataURI
);

// Batch mint
const winners = [
  { address: '0x...', place: 1, name: 'Winner 1', metadataURI: 'ipfs://...' },
  { address: '0x...', place: 2, name: 'Winner 2', metadataURI: 'ipfs://...' },
];

const batchResult = await mintNFTTrophyBatch(
  signer,
  chainId,
  tournamentId,
  tournamentName,
  winners
);
```

## 🔐 Security Features

1. **Owner-only minting**: Only the contract owner can mint trophies
2. **Duplicate prevention**: Same wallet cannot receive multiple trophies for the same tournament
3. **Pausable**: Contract can be paused in case of emergency
4. **Input validation**: All inputs are validated before minting
5. **Safe transfers**: Uses OpenZeppelin's `_safeMint()` for ERC-721 compliance

## 📊 Contract Addresses

After deployment, update `contracts/addresses.json` with the deployed contract addresses:

```json
{
  "networks": {
    "baseSepolia": {
      "contracts": {
        "PadelFlowNFTTrophy": {
          "address": "0x...",
          "deploymentBlock": 12345678,
          "deployer": "0x...",
          "deployedAt": "2025-12-03T22:00:00Z"
        }
      }
    }
  }
}
```

## 🧪 Testing

Run contract tests:

```bash
npx hardhat test
```

## 📚 Additional Resources

- [OpenZeppelin ERC-721 Documentation](https://docs.openzeppelin.com/contracts/4.x/erc721)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Base Network Documentation](https://docs.base.org)
- [XRPL EVM Documentation](https://xrpl.org/evm-sidechain.html)

## 🔮 Future Enhancements

- [ ] IPFS integration for automatic metadata upload
- [ ] Gasless minting via meta-transactions
- [ ] Cross-chain trophy transfers
- [ ] Tournament leaderboard smart contract
- [ ] NFT marketplace integration
- [ ] Dynamic NFT traits based on tournament performance
