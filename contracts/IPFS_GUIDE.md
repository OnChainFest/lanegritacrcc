# IPFS Integration Guide for NFT Trophies

This guide explains how to use IPFS (InterPlanetary File System) to store NFT metadata for PadelFlow trophies.

## 📋 Overview

NFTs require metadata (name, description, attributes, images) to be stored off-chain. IPFS is the industry standard for decentralized, permanent storage of NFT metadata.

### Why IPFS?

- **Decentralized**: No single point of failure
- **Permanent**: Content is addressed by hash (immutable)
- **Cost-effective**: Much cheaper than storing on blockchain
- **Standard**: Industry standard for NFTs (OpenSea, Rarible, etc.)

### What is Pinata?

Pinata is an IPFS "pinning service" that ensures your content remains available on IPFS. Without pinning, IPFS content can become unavailable if no nodes host it.

## 🚀 Quick Start

### Step 1: Create a Pinata Account

1. Go to [https://app.pinata.cloud/register](https://app.pinata.cloud/register)
2. Sign up for a free account (1GB free storage)
3. Verify your email

### Step 2: Get API Credentials

1. Go to [API Keys](https://app.pinata.cloud/developers/api-keys)
2. Click "New Key"
3. Select permissions:
   - ✅ **pinFileToIPFS**
   - ✅ **pinJSONToIPFS**
   - ✅ **unpin**
4. Give it a name (e.g., "PadelFlow NFT")
5. Click "Create Key"
6. **IMPORTANT**: Copy your API Key, API Secret, and JWT **immediately**
   - You won't be able to see them again!

### Step 3: Configure Environment

Add your Pinata credentials to `.env`:

```bash
# Copy the template
cp .env.contracts.example .env

# Edit .env and add your Pinata credentials
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Option 1: JWT (Recommended)**
```bash
PINATA_JWT=your_jwt_token_here
```

**Option 2: API Key + Secret (Legacy)**
```bash
PINATA_API_KEY=your_api_key_here
PINATA_API_SECRET=your_api_secret_here
```

### Step 4: Test Your Connection

```bash
# Test Pinata connection
node -e "require('./lib/ipfs/pinata').testPinataConnection().then(result => console.log('Connected:', result))"
```

## 🎯 Minting NFTs with IPFS Metadata

### Single Trophy Mint

```bash
# Set environment variables
export NFT_TROPHY_CONTRACT_ADDRESS=0xYourContractAddress
export RECIPIENT_ADDRESS=0xWinnerAddress

# Tournament details
export TOURNAMENT_ID=tournament-123
export TOURNAMENT_NAME="PadelFlow Championship 2025"
export TOURNAMENT_DATE="2025-12-03T00:00:00Z"
export TOURNAMENT_LOCATION="Miami, FL"
export TOURNAMENT_FORMAT=americano
export TOTAL_PLAYERS=32

# Winner details
export PLACE=1
export WINNER_NAME="John Doe"
export PARTNER_NAME="Jane Smith"
export FINAL_SCORE="6-4, 6-3"

# Optional: Custom trophy image (URL or file path)
export TROPHY_IMAGE=

# Mint with IPFS metadata
npx hardhat run scripts/deploy/mint-trophy-with-ipfs.ts --network baseSepolia
```

This will:
1. ✅ Upload trophy image to IPFS (or use default)
2. ✅ Generate NFT metadata (ERC-721 compliant)
3. ✅ Upload metadata JSON to IPFS
4. ✅ Mint NFT with IPFS metadata URI

### Batch Trophy Mint

For multiple winners, edit `scripts/deploy/mint-trophy-batch-with-ipfs.ts`:

```typescript
const winners = [
  {
    address: "0xWinner1Address",
    place: 1,
    winnerName: "First Place",
    partnerName: "Partner 1",
    finalScore: "6-4, 6-3",
    imageSource: null // or URL/path
  },
  {
    address: "0xWinner2Address",
    place: 2,
    winnerName: "Second Place",
    partnerName: "Partner 2",
    imageSource: null
  },
  // ... more winners
];
```

Then run:

```bash
export NFT_TROPHY_CONTRACT_ADDRESS=0xYourContractAddress
npx hardhat run scripts/deploy/mint-trophy-batch-with-ipfs.ts --network baseSepolia
```

## 📊 NFT Metadata Structure

The generated metadata follows the ERC-721 and OpenSea standards:

```json
{
  "name": "🥇 PadelFlow Championship 2025 - 1st Place",
  "description": "This NFT Trophy commemorates John Doe's 1st place finish...",
  "image": "ipfs://QmHash123...",
  "external_url": "https://padelflow.xyz/tournaments/tournament-123",
  "attributes": [
    {
      "trait_type": "Tournament",
      "value": "PadelFlow Championship 2025"
    },
    {
      "trait_type": "Place",
      "value": 1,
      "display_type": "number"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    },
    {
      "trait_type": "Winner",
      "value": "John Doe"
    },
    {
      "trait_type": "Format",
      "value": "Americano"
    },
    {
      "trait_type": "Total Players",
      "value": 32,
      "display_type": "number"
    },
    {
      "trait_type": "Tournament Date",
      "value": 1701648000,
      "display_type": "date"
    }
  ]
}
```

### Metadata Features

- **Rarity Levels**:
  - 1st Place = Legendary 🥇
  - 2nd Place = Epic 🥈
  - 3rd Place = Rare 🥉
  - 4th+ Place = Common 🏆

- **Attributes**: Filterable and sortable on marketplaces
- **External URL**: Links back to PadelFlow tournament page
- **Image**: Trophy image on IPFS

## 🖼️ Trophy Images

### Default Images

If no image is provided, the system uses placeholder images:
- Gold trophy for 1st place
- Silver trophy for 2nd place
- Bronze trophy for 3rd place
- Blue trophy for other places

### Custom Images

You can provide custom trophy images in three ways:

**1. From URL:**
```bash
export TROPHY_IMAGE=https://example.com/trophy.png
```

**2. From Local File:**
```bash
export TROPHY_IMAGE=/path/to/trophy.png
```

**3. From IPFS Hash:**
```bash
export TROPHY_IMAGE=ipfs://QmHash...
```

### Image Requirements

- **Format**: PNG, JPG, GIF, or SVG
- **Size**: Recommended 600x600px or larger
- **Max Size**: 10MB (Pinata free tier)
- **Aspect Ratio**: Square (1:1) recommended

## 🔧 Programmatic Usage

### Upload Metadata from Code

```typescript
import { uploadTrophyMetadata } from '@/lib/ipfs/upload-trophy-metadata';
import type { TournamentData, WinnerData } from '@/lib/ipfs/metadata';

const tournament: TournamentData = {
  tournamentId: 'tournament-123',
  tournamentName: 'PadelFlow Championship 2025',
  tournamentDate: new Date().toISOString(),
  format: 'americano',
  totalPlayers: 32
};

const winner: WinnerData = {
  place: 1,
  winnerName: 'John Doe'
};

const result = await uploadTrophyMetadata(
  tournament,
  winner,
  null, // null = use default image
  organizerAddress
);

console.log('Metadata URI:', result.metadataUri);
// Output: ipfs://QmHash123...
```

### Batch Upload

```typescript
import { uploadBatchTrophyMetadata } from '@/lib/ipfs/upload-trophy-metadata';

const winners = [
  { place: 1, winnerName: 'Winner 1' },
  { place: 2, winnerName: 'Winner 2' },
  { place: 3, winnerName: 'Winner 3' }
];

const imageSources = [null, null, null]; // Use defaults

const results = await uploadBatchTrophyMetadata(
  tournament,
  winners,
  imageSources,
  organizerAddress
);

results.forEach(result => {
  console.log('Metadata URI:', result.metadataUri);
});
```

## 🌐 Viewing IPFS Content

### Via Pinata Gateway

```
https://gateway.pinata.cloud/ipfs/QmHash123...
```

### Via Public IPFS Gateways

```
https://ipfs.io/ipfs/QmHash123...
https://cloudflare-ipfs.com/ipfs/QmHash123...
https://gateway.ipfs.io/ipfs/QmHash123...
```

### Via IPFS Desktop

1. Install [IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/)
2. Open: `ipfs://QmHash123...`

## 📈 Managing Pinned Content

### List All Pins

```typescript
import { listPinnedContent } from '@/lib/ipfs/pinata';

const pins = await listPinnedContent();
console.log(`Total pins: ${pins.length}`);
```

### Unpin Content

```typescript
import { unpinFromIPFS } from '@/lib/ipfs/pinata';

const success = await unpinFromIPFS('QmHash123...');
console.log('Unpinned:', success);
```

**⚠️ Warning**: Unpinning removes content from IPFS. Only unpin if you're sure the content is no longer needed!

## 💰 Pinata Pricing

### Free Tier
- **Storage**: 1 GB
- **Bandwidth**: 100 GB/month
- **Perfect for**: Testing and small tournaments

### Picnic Plan ($20/month)
- **Storage**: 100 GB
- **Bandwidth**: 1 TB/month
- **Perfect for**: Regular tournament organizers

### Yacht Plan ($100/month)
- **Storage**: 1 TB
- **Bandwidth**: 10 TB/month
- **Perfect for**: Clubs and federations

## 🐛 Troubleshooting

### "Pinata API error: 401"

**Problem**: Invalid API credentials

**Solution**:
1. Check your `.env` file has correct credentials
2. Verify API key is active in Pinata dashboard
3. Try regenerating API key

### "Pinata API error: 429"

**Problem**: Rate limit exceeded

**Solution**:
1. Free tier: Max 180 requests/minute
2. Wait 60 seconds and try again
3. Consider upgrading to paid plan

### "Failed to upload image"

**Problem**: Image too large or invalid format

**Solution**:
1. Check image is < 10MB
2. Verify format is PNG, JPG, GIF, or SVG
3. Try compressing the image

### "IPFS content not loading"

**Problem**: Gateway timeout or content not pinned

**Solution**:
1. Try a different IPFS gateway
2. Check Pinata dashboard to verify pin status
3. Wait a few minutes for IPFS propagation

## 🔒 Security Best Practices

1. **Never commit API keys**: Keep `.env` in `.gitignore`
2. **Use environment variables**: Don't hardcode credentials
3. **Rotate keys regularly**: Generate new keys every 90 days
4. **Use JWT tokens**: More secure than API Key + Secret
5. **Set minimum permissions**: Only enable required permissions
6. **Monitor usage**: Check Pinata dashboard for unusual activity

## 📚 Additional Resources

- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [OpenSea Metadata Standards](https://docs.opensea.io/docs/metadata-standards)
- [ERC-721 Specification](https://eips.ethereum.org/EIPS/eip-721)

## 🆘 Need Help?

- **Pinata Support**: [support@pinata.cloud](mailto:support@pinata.cloud)
- **IPFS Forums**: [https://discuss.ipfs.tech/](https://discuss.ipfs.tech/)
- **PadelFlow Issues**: [GitHub Issues](https://github.com/OnChainFest/padelflow/issues)

---

**Ready to upload?** Follow the Quick Start guide above and start minting NFT trophies with permanent IPFS metadata! 🚀
