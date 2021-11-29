# Chainlink Hackathon Fall 2021 DeFi Project -- PrimeDeFi
***

![PrimeDeFi Login](/img/login.png "PrimeDeFi dApp Login Page")

## PrimeDeFi DApp Walkthrough DEMO

A video walking-through of this DApp can be found here:
(https://youtu.be/8EzMlSz-iHI)

## Project Description

PrimeDeFi is our proposed DeFi protocol operating on smart blockchains. PrimeDeFi envisions a decentralized virtual deal room that ebables debt (such as bonds or loans) issuers to tokenize their deb issuances, and the issuance / book-building processes automated. It also enables investors to bid on any open issuances by connecting to the dApp via their web3 wallets, and manage their own bids and wallet balances within the dapp. PrimeDeFi will eliminate the need of any traditional middlemen, improves efficiency, and revolutionize the capital market fund raising processes for issuers and investors.

### Introduction

This project is an Ethereum Web 3.0 decentralized application (DApp), with smart contracts written in solidity, and user front end written in typescript and javascript.

The essential features include tokenization of newly issued debt instruments and complete end-to-end automation of the debt offering and issuance process. All of the transaction related deals data will be persisted on-chain, with real time settlement and pre-defined time or event triggered actions powered by Chainlink keepers. We also leverage on Chainlink oracle services to port on-chain certain off-chain data feed such as issuer credit rating.

### User Stories

Through their dashboards, **issuers** can view/manage their wallet balances (only USDC stablecoin and our own ERC20 deal tokens are allowed at this time), create/edit deal issuances, search/view a list of existing deal issuances, and monitor deal's fund raising progress (total raised vs offer sizie).

Issuers also can view/edit their profiles, and upload/manage documents via IPFS.

Through their dashboards, **investors** can browse through a list of open issuances, check on relevant documents and issuance criteria. select the ones interested and make bids for investments

Investors also can deposit into and withdraw from own wallets, review bid status and final result, and monitor wallet balances.

![PrimeDeFi Dashboard](/img/dashboard.gif "PrimeDeFi dApp User Dashboard")

#### Issuer Dashboard

Issuer dashboard is the first page that issuers will see after they log into PrimeDeFi DApp, from a Web3 enabled browser. It displays everything related to:

- Issuer profile
- A list of past and open issuances from this issuer
- Details of each issuance as they go through the list
- All potential actions for issuers to take at every screen (such as set up new issuance, upload documents, start issuance process, etc.)
- Issuance summary post each issuance closure
- [Additional screens/actions]

- **Requirements to Set Up a New Issuer Profile | View:** A cardboard displaying current rules | **Actions:** None
- **Requirements to Set Up a New Issuance | View:** A cardboard displaying current rules | **Actions:** None
- **Issuance or issuer account alert | View:** Flash banners showing relevant alert/reminder | **Actions:** Issuers can scroll down to the bottom of the Issuer Dashboard for relevant actions to be taken
- **Existing and upcoming issuance details | View:** Issuance description, current price, next payment due, current time, etc. | **Actions:** Start Issuance, Special Actions, Copy from Existing Issuance to Set up New One, etc.
- **New issuance Setup Details | View:** Issuance description, offer size, minimum launch size, offer start date/close date, term, interest rate, payment dates, etc. | **Actions:** Confirm Set Up, Cancel
- **Open Issuance status | View:** Details of the issuance, Time to closure, # of Bids Received, Total Bids Size, etc. | **Actions:** [Special Actions] etc.
- **New Issuance summary | View:** Details of the issuance just closed: etc. | **Actions:** None
- **Additional actions | View:** List of additional actions that issuers can take at their relevant issuance stage and overall monitoring process | **Actions:** Refresh, Set Up New Issuance or Open Issuance Summary

#### Investor Dashboard

Investor dashboard is the first page that investors see after they log into PrimeDeFi from a Web3 MetaMask enabled browser. It displays everything related to:

- Investment Summary
- Open issuance details
- Bid status
- Wallet status
- [Additional actions]

## Project Architecture and Technical Requirements

### Solidity Contracts

#### Deal.sol

This contract is a child of OpenZepplin's `Ownable.sol` contract.

- Contract does not have addresses with DEFAULT_ADMIN role
- OWNER role is the admin role
- uses library `SafeMath` to protest against Integer Overflow and Underflow attacks

### Folder Structure

- `root directory`: A standard truffle project structure with `truffle-config.js` to set up smart contract development and deployment environment, and `package.json` to install all necessary dependencies for local contract development.
- `client/` folder: A standard React based client-side implementation of the project. It was built with `truffle unbox react`.

## How to Run this DApp

### Pre-requisites


#### 1. Node.js

Check whether you have Node.js in your machine with the following command, otherwise click [here](https://nodejs.org/en/) to install it.

```bash
node -v
```

#### 2. NPM/Yarn

If you have installed Node.js in your machine, NPM will already be installed along with it. Check whether NPM is installed within your machine with the following command.

```bash
npm -v
```

Otherwise, if you want to use Yarn as your package manager. Go to its [official website](https://yarnpkg.com/) and follow the installation process. Once installed, check Yarn with the following command.

```bash
yarn -v
```

#### 3. Truffle

Check whether you have `truffle` in your machine with the following command.

```bash
truffle version
```

Otherwise, use the following command to install the `truffle` CLI globally into your machine.

```bash
# NPM
npm i -g truffle

# Yarn
yarn global add truffle
```

#### 4. Solidity (solc-js)

If you installed truffle, it should come with `solc-js` by default. As an additional tool, install `Solidity` and `Solidity Extended` VSCode Plugin by `Juan Blanco` and `beaugunderson`, respectively.


#### 5. Moralis Admin Account

If you have not signed up to Moralis yet, click [here](https://admin.moralis.io/register) to register and get your free Moralis Admin account in just a few minutes!

#### 6. Metamask

If you have not installed Metamask in your browser, click [here](https://metamask.io/download.html) and follow the instruction to complete the installation process.

### Getting Started
 
#### 1. Install dependencies

```bash
# NPM
npm i

# Yarn
yarn
```
#### 2. Add Environment Variables

Copy `.env.example` and rename it `.env` and fill in the following variables

```
ETHERSCAN_API_KEY=xxx
POLYGONSCAN_API_KEY=xxx
BSCSCAN_API_KEY=xxx
FTMSCAN_API_KEY=xxx
SNOWTRACE_API_KEY=xxx
MORALIS_SPEEDY_NODES_KEY=xxx
ARCHIVE=xxx
```

#### 3. Compile the project

```bash
# NPM
npm run compile

# Yarn
yarn compile
```

#### 4. Test the project

```bash
# NPM
npm run test

# Yarn
yarn test
```

### Development

#### 1. Deploy to Testnet

In order to deploy your smart contracts to the test network, make sure that your mnemonics in `.secret` and `MORALIS_SPEEDY_NODES_KEY` in `.env` defined. Then, deploy your contract to the available network defined in `truffle.config.js`

```
yarn migrate --network kovan
```

#### 2. Running the Frontend React App

First, follow the setup guideline for the Frontend app [here](https://github.com/Web3-Hackers/PrimeDefi/blob/master/client/README.md). Then, navigate to `/client` and run the following command.

```bash
# NPM
npm run start

# Yarn
yarn start
```

## Tools/Libraries Used to Build/Test this Project

- **Solidity** is used to write the smart contract sitting in the backend
- ......
- **Chainlink** is used as off-chain Oracle market data provider
- ......

## Unit Tests (*Solidity and JavaScript tests*)
