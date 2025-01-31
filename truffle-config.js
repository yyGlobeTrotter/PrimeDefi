const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();
require("dotenv").config();
const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  // Disable `plugins` & `api_keys` if you don't want to verify smart contracts
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    polygonscan: process.env.POLYGONSCAN_API_KEY,
    bscscan: process.env.BSCSCAN_API_KEY,
    ftmscan: process.env.FTMSCAN_API_KEY,
    snowtrace: process.env.SNOWTRACE_API_KEY,
  },
  networks: {
    develop: {
      port: 8545,
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://speedy-nodes-nyc.moralis.io/${
            process.env.MORALIS_SPEEDY_NODES_KEY
          }/eth/ropsten${process.env.ARCHIVE === true ? "/archive" : ""}`
        ),
      network_id: 3,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    kovan: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://speedy-nodes-nyc.moralis.io/${
            process.env.MORALIS_SPEEDY_NODES_KEY
          }/eth/kovan${process.env.ARCHIVE === true ? "/archive" : ""}`
        ),
      network_id: 42,
      // gasPrice: 20000000000,
      gas: 3716887,
      skipDryRun: true,
      networkCheckTimeout: 100000,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://speedy-nodes-nyc.moralis.io/${
            process.env.MORALIS_SPEEDY_NODES_KEY
          }/eth/rinkeby${process.env.ARCHIVE === true ? "/archive" : ""}`
        ),
      network_id: 4,
      skipDryRun: true,
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://speedy-nodes-nyc.moralis.io/${
            process.env.MORALIS_SPEEDY_NODES_KEY
          }/eth/goerli${process.env.ARCHIVE === true ? "/archive" : ""}`
        );
      },
      network_id: 5,
      gas: 4465030,
      gasPrice: 10000000000,
    },
    mainnet: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          `https://speedy-nodes-nyc.moralis.io/${
            process.env.MORALIS_SPEEDY_NODES_KEY
          }/eth/mainnet${process.env.ARCHIVE === true ? "/archive" : ""}`
        );
      },
      gas: 5000000,
      gasPrice: 5e9,
      network_id: 1,
    },
    binance_testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://speedy-nodes-nyc.moralis.io/${
            process.env.MORALIS_SPEEDY_NODES_KEY
          }/bsc/testnet${process.env.ARCHIVE === true ? "/archive" : ""}`
        ),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    binance_mainnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://speedy-nodes-nyc.moralis.io/${
            process.env.MORALIS_SPEEDY_NODES_KEY
          }/bsc/mainnet${process.env.ARCHIVE === true ? "/archive" : ""}`
        ),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    polygon_mumbai: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://speedy-nodes-nyc.moralis.io/${
            process.env.MORALIS_SPEEDY_NODES_KEY
          }/polygon/mumbai${process.env.ARCHIVE === true ? "/archive" : ""}`
        ),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    polygon_mainnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://speedy-nodes-nyc.moralis.io/${
            process.env.MORALIS_SPEEDY_NODES_KEY
          }/polygon/mainnet${process.env.ARCHIVE === true ? "/archive" : ""}`
        ),
      network_id: 137,
      confirmations: 3,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    avalanche_mainnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_SPEEDY_NODES_KEY}/avalanche/mainnet`
        ),
      network_id: 43114,
      skipDryRun: true,
    },
    fantom_mainnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_SPEEDY_NODES_KEY}/fantom/mainnet`
        ),
      network_id: 250,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
