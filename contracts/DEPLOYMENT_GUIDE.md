# NFT Trophy Contract Deployment Guide

This guide provides step-by-step instructions for deploying the PadelFlow NFT Trophy smart contract to various blockchain networks.

## 🚨 Important Note: Hardhat 3.x and Next.js Compatibility

Due to Hardhat 3.x requiring ESM (`"type": "module"` in package.json) and Next.js using CommonJS by default, you have two options for compilation and deployment:

### Option 1: Temporary ESM Mode (Recommended for Quick Deployment)

```bash
# 1. Temporarily enable ESM
npm pkg set type="module"

# 2. Compile the contract
npx hardhat compile

# 3. Deploy (choose your network)
npx hardhat run scripts/deploy/deploy-nft-trophy.ts --network baseSepolia

# 4. Restore CommonJS (important!)
npm pkg delete type
```

### Option 2: Separate Hardhat Project (Recommended for Production)

Create a separate Hardhat project in a subdirectory:

```bash
# 1. Create a new directory
mkdir padelflow-contracts
cd padelflow-contracts

# 2. Initialize a new Hardhat project
npm init -y
npm pkg set type="module"
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts

# 3. Copy contract files
cp ../contracts/*.sol ./contracts/
cp ../scripts/deploy/*.ts ./scripts/
cp ../hardhat.config.js ./

# 4. Compile and deploy
npx hardhat compile
npx hardhat run scripts/deploy-nft-trophy.ts --network baseSepolia
```

### Option 3: Use Docker (Enterprise Solution)

```dockerfile
# Dockerfile.hardhat
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY contracts ./contracts
COPY scripts/deploy ./scripts
COPY hardhat.config.js ./

RUN npm install
RUN npx hardhat compile

CMD ["npx", "hardhat", "run", "scripts/deploy-nft-trophy.ts"]
```

```bash
# Build and run
docker build -f Dockerfile.hardhat -t padelflow-hardhat .
docker run --env-file .env padelflow-hardhat
```

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] **Private Key**: Wallet private key with funds for gas fees
- [ ] **RPC URL**: Network RPC endpoint (Base, Base Sepolia, or XRPL EVM)
- [ ] **Test Funds**: Testnet ETH for Base Sepolia (get from [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))
- [ ] **Block Explorer API Key**: (Optional) For contract verification on Basescan

## 🔑 Environment Setup

1. Copy the environment template:
```bash
cp .env.contracts.example .env
```

2. Fill in your values in `.env`:
```bash
# CRITICAL: Keep this secret!
PRIVATE_KEY=your_wallet_private_key_here

# Network RPC URLs
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_RPC_URL=https://mainnet.base.org

# For contract verification (optional)
BASESCAN_API_KEY=your_api_key_here
```

3. **IMPORTANT**: Never commit `.env` to git!

## 🚀 Deployment Steps

### Step 1: Get Testnet Funds

For Base Sepolia testnet:
1. Visit [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. Connect your wallet
3. Request test ETH

### Step 2: Compile the Contract

```bash
# Using Option 1 (temporary ESM)
npm pkg set type="module"
npx hardhat compile
npm pkg delete type
```

You should see:
```
Compiled 1 Solidity file successfully
```

### Step 3: Deploy to Testnet

```bash
# Deploy to Base Sepolia
npm run hardhat:deploy:sepolia

# OR run the script directly
npx hardhat run scripts/deploy/deploy-nft-trophy.ts --network baseSepolia
```

Expected output:
```
🚀 Deploying PadelFlowNFTTrophy contract...

📝 Deploying with account: 0x...
💰 Account balance: 0.1 ETH

⏳ Deploying contract...
✅ PadelFlowNFTTrophy deployed to: 0x...
🔑 Owner: 0x...

📋 Contract Details:
   - Name: PadelFlow Trophy
   - Symbol: PFTROPHY
   - Network: baseSepolia
   - Chain ID: 84532

✅ Block confirmations complete

📝 Save this information:
   Contract Address: 0x...
   Deployer Address: 0x...
   Transaction Hash: 0x...
```

### Step 4: Update Contract Addresses

After successful deployment, update `contracts/addresses.json`:

```json
{
  "networks": {
    "baseSepolia": {
      "contracts": {
        "PadelFlowNFTTrophy": {
          "address": "0xYourDeployedContractAddress",
          "deploymentBlock": 12345678,
          "deployer": "0xYourWalletAddress",
          "deployedAt": "2025-12-03T22:00:00Z"
        }
      }
    }
  }
}
```

### Step 5: Verify the Contract

Verify your contract on Basescan for transparency:

```bash
npx hardhat verify --network baseSepolia \
  0xYourContractAddress \
  0xYourDeployerAddress
```

## 🎯 Testing the Deployment

### Mint a Test Trophy

```bash
# Set environment variables
export NFT_TROPHY_CONTRACT_ADDRESS=0xYourContractAddress
export RECIPIENT_ADDRESS=0xTestWalletAddress
export TOURNAMENT_ID=test-tournament-1
export TOURNAMENT_NAME="Test Championship 2025"
export PLACE=1
export WINNER_NAME="Test Winner"
export METADATA_URI=ipfs://QmTestHash...

# Run mint script
npx hardhat run scripts/deploy/mint-trophy.ts --network baseSepolia
```

### Batch Mint Test Trophies

1. Edit `scripts/deploy/mint-trophy-batch.ts`
2. Update the `winners` array with test addresses
3. Run:

```bash
export NFT_TROPHY_CONTRACT_ADDRESS=0xYourContractAddress
npx hardhat run scripts/deploy/mint-trophy-batch.ts --network baseSepolia
```

## 🌐 Production Deployment (Base Mainnet)

**⚠️ WARNING**: This costs real money! Double-check everything!

1. **Ensure you have mainnet ETH** in your wallet for gas fees

2. **Review the contract** one final time

3. **Deploy to Base Mainnet**:
```bash
npm run hardhat:deploy:base
```

4. **Verify immediately**:
```bash
npx hardhat verify --network base \
  0xYourContractAddress \
  0xYourDeployerAddress
```

5. **Update `contracts/addresses.json`** with production address

6. **Test with a small transaction** before full usage

## 🔍 Verify Deployment

Check your contract on the block explorer:

- **Base Sepolia**: https://sepolia.basescan.org/address/0xYourContractAddress
- **Base Mainnet**: https://basescan.org/address/0xYourContractAddress
- **XRPL EVM**: https://evm-sidechain.xrpl.org/address/0xYourContractAddress

## 🛠️ Troubleshooting

### "Insufficient funds" error
- **Solution**: Add more ETH to your deployer wallet

### "Nonce too high" error
- **Solution**: Reset your wallet's transaction history or wait for pending transactions

### "Contract deployment failed" error
- **Solution**: Check your RPC URL is correct and network is accessible

### "Cannot find module" errors during compile
- **Solution**: Run `npm install --legacy-peer-deps` to reinstall dependencies

### Hardhat compilation issues with Next.js
- **Solution**: Use Option 1 (temporary ESM) or Option 2 (separate project) from above

## 📊 Gas Cost Estimates

Approximate gas costs for deployment and operations:

| Operation | Gas Used | Cost @ 1 gwei | Cost @ 10 gwei |
|-----------|----------|---------------|----------------|
| Deploy Contract | ~2,500,000 | 0.0025 ETH | 0.025 ETH |
| Mint Single Trophy | ~150,000 | 0.00015 ETH | 0.0015 ETH |
| Batch Mint (3 trophies) | ~350,000 | 0.00035 ETH | 0.0035 ETH |

*Actual costs vary based on network congestion*

## 🔐 Security Best Practices

1. **Never share your private key**
2. **Use a hardware wallet** for production deployments
3. **Test thoroughly on testnet** before mainnet
4. **Set up a multi-sig wallet** for contract ownership in production
5. **Audit the contract** before handling significant value
6. **Monitor the contract** after deployment for unusual activity

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Base Network Docs](https://docs.base.org)
- [XRPL EVM Docs](https://xrpl.org/evm-sidechain.html)
- [Ethers.js Documentation](https://docs.ethers.org)

## 🆘 Need Help?

If you encounter issues:
1. Check the [Hardhat Discord](https://hardhat.org/discord)
2. Review [Base Network Support](https://base.org/discord)
3. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/hardhat)
4. Open an issue in the PadelFlow repository

---

**Ready to deploy?** Follow the steps above carefully, and you'll have your NFT Trophy contract live in minutes! 🚀
