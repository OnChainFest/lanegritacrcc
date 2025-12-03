require("@nomicfoundation/hardhat-toolbox");

/**
 * Hardhat configuration for PadelFlow NFT Trophy contracts
 *
 * Networks:
 * - Base Mainnet: Production deployment
 * - Base Sepolia: Testnet deployment
 * - XRPL EVM Sidechain: Alternative blockchain option
 * - Local: Hardhat network for testing
 */

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local Hardhat network (default)
    hardhat: {
      chainId: 31337,
    },

    // Base Mainnet
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8453,
    },

    // Base Sepolia Testnet
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532,
    },

    // XRPL EVM Sidechain
    xrplEvm: {
      url: process.env.XRPL_EVM_RPC_URL || "https://rpc-evm-sidechain.xrpl.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1440002,
    },
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY || "",
      baseSepolia: process.env.BASESCAN_API_KEY || "",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test/contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
