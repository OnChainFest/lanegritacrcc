/**
 * Web3 Integration for PadelFlow MVP Dashboard
 *
 * This script provides wallet connection and NFT minting functionality
 * for the MVP dashboard using ethers.js
 */

// Contract ABI - only the functions we need
const NFT_TROPHY_ABI = [
    {
        "inputs": [
            {"name": "recipient", "type": "address"},
            {"name": "tournamentId", "type": "string"},
            {"name": "tournamentName", "type": "string"},
            {"name": "place", "type": "uint256"},
            {"name": "winnerName", "type": "string"},
            {"name": "metadataURI", "type": "string"}
        ],
        "name": "mint",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "recipient", "type": "address"},
            {"name": "tournamentId", "type": "string"}
        ],
        "name": "hasReceivedTrophy",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "name": "tokenId", "type": "uint256"},
            {"indexed": true, "name": "recipient", "type": "address"},
            {"indexed": false, "name": "tournamentId", "type": "string"},
            {"indexed": false, "name": "tournamentName", "type": "string"},
            {"indexed": false, "name": "place", "type": "uint256"},
            {"indexed": false, "name": "winnerName", "type": "string"}
        ],
        "name": "TrophyMinted",
        "type": "event"
    }
];

// Contract addresses by chain ID
const CONTRACT_ADDRESSES = {
    8453: '', // Base Mainnet - UPDATE AFTER DEPLOYMENT
    84532: '', // Base Sepolia - UPDATE AFTER DEPLOYMENT
};

// Chain configurations
const CHAINS = {
    8453: {
        chainId: '0x2105',
        chainName: 'Base',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.base.org'],
        blockExplorerUrls: ['https://basescan.org']
    },
    84532: {
        chainId: '0x14a34',
        chainName: 'Base Sepolia',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.base.org'],
        blockExplorerUrls: ['https://sepolia.basescan.org']
    }
};

// Global state
let web3State = {
    provider: null,
    signer: null,
    address: null,
    chainId: null,
    isConnected: false
};

/**
 * Check if MetaMask is installed
 */
function isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
}

/**
 * Connect wallet
 */
async function connectWallet() {
    if (!isMetaMaskInstalled()) {
        alert('Please install MetaMask to mint NFT trophies!\n\nVisit: https://metamask.io');
        return false;
    }

    try {
        // Request account access
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        web3State = {
            provider,
            signer,
            address,
            chainId: network.chainId,
            isConnected: true
        };

        console.log('✅ Wallet connected:', address);
        console.log('   Network:', network.name, `(${network.chainId})`);

        // Update UI
        updateWalletUI();

        return true;
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet. Please try again.');
        return false;
    }
}

/**
 * Switch to Base Sepolia network
 */
async function switchToBaseSepolia() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CHAINS[84532].chainId }],
        });

        // Update state
        await connectWallet();
        return true;
    } catch (error) {
        // Chain not added, try to add it
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [CHAINS[84532]],
                });
                await connectWallet();
                return true;
            } catch (addError) {
                console.error('Failed to add network:', addError);
                return false;
            }
        }
        console.error('Failed to switch network:', error);
        return false;
    }
}

/**
 * Switch to Base Mainnet network
 */
async function switchToBase() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CHAINS[8453].chainId }],
        });

        await connectWallet();
        return true;
    } catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [CHAINS[8453]],
                });
                await connectWallet();
                return true;
            } catch (addError) {
                console.error('Failed to add network:', addError);
                return false;
            }
        }
        console.error('Failed to switch network:', error);
        return false;
    }
}

/**
 * Get contract instance
 */
function getContract() {
    if (!web3State.isConnected) {
        throw new Error('Wallet not connected');
    }

    const contractAddress = CONTRACT_ADDRESSES[web3State.chainId];
    if (!contractAddress) {
        throw new Error(`Contract not deployed on chain ${web3State.chainId}`);
    }

    return new ethers.Contract(contractAddress, NFT_TROPHY_ABI, web3State.signer);
}

/**
 * Upload metadata to IPFS (simplified version using Pinata API)
 */
async function uploadMetadataToIPFS(tournament, winner) {
    // Check if Pinata credentials are configured
    const pinataJWT = ''; // TODO: Add Pinata JWT from environment

    if (!pinataJWT) {
        console.warn('Pinata not configured, using placeholder metadata');
        return 'ipfs://QmPlaceholder...';
    }

    try {
        // Generate metadata
        const metadata = {
            name: `🏆 ${tournament.name} - ${getPlaceSuffix(winner.place)} Place`,
            description: `NFT Trophy for ${winner.winnerName}'s ${getPlaceSuffix(winner.place)} place finish in ${tournament.name}`,
            image: getDefaultTrophyImage(winner.place),
            attributes: [
                { trait_type: 'Tournament', value: tournament.name },
                { trait_type: 'Place', value: winner.place },
                { trait_type: 'Winner', value: winner.winnerName },
                { trait_type: 'Rarity', value: getRarity(winner.place) }
            ]
        };

        // Upload to Pinata
        const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${pinataJWT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pinataContent: metadata,
                pinataMetadata: {
                    name: `trophy-${tournament.id}-place-${winner.place}`
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to upload to IPFS');
        }

        const result = await response.json();
        return `ipfs://${result.IpfsHash}`;
    } catch (error) {
        console.error('IPFS upload error:', error);
        // Fallback to placeholder
        return `ipfs://QmPlaceholder${winner.place}`;
    }
}

/**
 * Mint NFT Trophy
 */
async function mintNFTTrophy(tournament, winner) {
    try {
        console.log('🏆 Starting NFT mint process...');

        // 1. Check wallet connection
        if (!web3State.isConnected) {
            const connected = await connectWallet();
            if (!connected) {
                throw new Error('Please connect your wallet first');
            }
        }

        // 2. Check if on supported network
        const supportedChains = Object.keys(CONTRACT_ADDRESSES).map(Number);
        if (!supportedChains.includes(web3State.chainId)) {
            console.log('Wrong network, switching to Base Sepolia...');
            const switched = await switchToBaseSepolia();
            if (!switched) {
                throw new Error('Please switch to Base or Base Sepolia network');
            }
        }

        // 3. Check if contract is deployed
        const contractAddress = CONTRACT_ADDRESSES[web3State.chainId];
        if (!contractAddress || contractAddress === '') {
            throw new Error(`NFT Trophy contract not yet deployed on this network.\n\nPlease deploy the contract first or switch to a network where it's deployed.`);
        }

        // 4. Validate winner wallet address
        if (!winner.walletAddress || !ethers.utils.isAddress(winner.walletAddress)) {
            throw new Error('Invalid winner wallet address');
        }

        // 5. Get contract
        const contract = getContract();

        // 6. Check if already minted
        console.log('   Checking for existing trophy...');
        const alreadyMinted = await contract.hasReceivedTrophy(winner.walletAddress, tournament.id);
        if (alreadyMinted) {
            throw new Error('Winner already has a trophy for this tournament');
        }

        // 7. Upload metadata to IPFS
        console.log('   Uploading metadata to IPFS...');
        const metadataURI = await uploadMetadataToIPFS(tournament, winner);
        console.log('   ✅ Metadata URI:', metadataURI);

        // 8. Mint NFT
        console.log('   Sending mint transaction...');
        const tx = await contract.mint(
            winner.walletAddress,
            tournament.id,
            tournament.name,
            winner.place,
            winner.winnerName,
            metadataURI
        );

        console.log('   📤 Transaction sent:', tx.hash);
        console.log('   ⏳ Waiting for confirmation...');

        // 9. Wait for confirmation
        const receipt = await tx.wait();
        console.log('   ✅ Transaction confirmed in block:', receipt.blockNumber);

        // 10. Extract token ID from event
        let tokenId = '0';
        try {
            const event = receipt.logs.find(log => {
                try {
                    const parsed = contract.interface.parseLog(log);
                    return parsed.name === 'TrophyMinted';
                } catch {
                    return false;
                }
            });

            if (event) {
                const parsed = contract.interface.parseLog(event);
                tokenId = parsed.args.tokenId.toString();
            }
        } catch (error) {
            console.warn('Could not extract token ID from events');
        }

        console.log('🎉 NFT Trophy minted successfully!');
        console.log('   Token ID:', tokenId);

        return {
            success: true,
            txHash: tx.hash,
            tokenId,
            metadataURI,
            blockExplorerUrl: getBlockExplorerUrl(web3State.chainId, tx.hash)
        };

    } catch (error) {
        console.error('❌ Minting failed:', error);

        // User-friendly error messages
        let errorMessage = error.message;

        if (error.message.includes('user rejected')) {
            errorMessage = 'Transaction cancelled by user';
        } else if (error.message.includes('insufficient funds')) {
            errorMessage = 'Insufficient ETH for gas fees';
        } else if (error.message.includes('already has trophy')) {
            errorMessage = 'Winner already has a trophy for this tournament';
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}

/**
 * Helper functions
 */

function getPlaceSuffix(place) {
    if (place === 1) return '1st';
    if (place === 2) return '2nd';
    if (place === 3) return '3rd';
    return `${place}th`;
}

function getRarity(place) {
    if (place === 1) return 'Legendary';
    if (place === 2) return 'Epic';
    if (place === 3) return 'Rare';
    return 'Common';
}

function getDefaultTrophyImage(place) {
    const colors = ['gold', 'silver', 'bronze', 'blue'];
    const color = colors[Math.min(place - 1, colors.length - 1)];
    return `https://placehold.co/600x600/${color}/white?text=${getPlaceSuffix(place)}+Trophy`;
}

function getBlockExplorerUrl(chainId, txHash) {
    const explorers = {
        8453: 'https://basescan.org/tx/',
        84532: 'https://sepolia.basescan.org/tx/'
    };
    return explorers[chainId] ? `${explorers[chainId]}${txHash}` : null;
}

function formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function updateWalletUI() {
    // Update wallet button if exists
    const walletBtn = document.getElementById('connect-wallet-btn');
    if (walletBtn) {
        if (web3State.isConnected) {
            walletBtn.textContent = `Connected: ${formatAddress(web3State.address)}`;
            walletBtn.classList.add('bg-green-600');
            walletBtn.classList.remove('bg-primary');
        } else {
            walletBtn.textContent = 'Connect Wallet';
            walletBtn.classList.remove('bg-green-600');
            walletBtn.classList.add('bg-primary');
        }
    }
}

// Listen for account changes
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            web3State.isConnected = false;
            updateWalletUI();
        } else {
            connectWallet();
        }
    });

    window.ethereum.on('chainChanged', () => {
        connectWallet();
    });
}

// Export functions to global scope
window.web3Integration = {
    connectWallet,
    switchToBase,
    switchToBaseSepolia,
    mintNFTTrophy,
    isConnected: () => web3State.isConnected,
    getAddress: () => web3State.address,
    getChainId: () => web3State.chainId
};

console.log('✅ Web3 Integration loaded');
