# Chainlink Hackathon Fall 2021 DeFi Project -- PrimeDeFi
***

![PrimeDeFi Login](/img/login.png "PrimeDeFi dApp Login Page")


## PrimeDeFi DApp Walkthrough DEMO

A video walking-through of this DApp can be found here:
(TBD)


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

- Issuer profile including total value raised, and credit rating
- A list of past and open issuances from this issuer
- Details of each issuance as they go through the list
- Wallet status
- All potential actions for issuers to take at every screen (such as create new issuance, search for existing issuances, and disconnect wallet)


#### Investor Dashboard

Investor dashboard is the first page that investors will see after they log into PrimeDeFi from a Web3 MetaMask enabled browser. It displays everything related to:

- Search criteria (by bond name, company name, issuer credit rating, or by offer closing date)
- Existing deal issuance details (organized by currently raising, raised, and completed)
- Wallet status
- All potential actions for investors to take at every screen (such as bid for investment, search for existing issuances, and disconnect wallet)


## Project Infrastructure & Technical Requirements

![PrimeDeFi Infra](/img/infra.jpg "PrimeDeFi dApp technical infrastruture")


### Solidity Contracts

![PrimeDeFi Contracts Relationship](/img/contracts_rel.jpg "PrimeDeFi dApp smart contract relationship illustration")


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

- **Ethereum Solidity** is used to write the smart contract sitting in the backend
- **Typescript** and **Javascript** are used to wrtie front end web3 compatible scripts
- **Moralis** is used as front end builder tool
- **Chainlink** is used as off-chain real world data service provider for on-chain contracts
- **Remix IDE** and **Truffle** are used as local dev/debug environment for back-end developers
- **Figma** is used as UI/UX design tool
- **IPFS** is used as decentralized file storage provider
- **MetaMask** is used as Web3.0 wallet provider
- **Moralis** and **Infura** are used as gateways to the blockchains
- **GitHub** is used as version control tool for all devs


## Test Cases

Test cases are included in PrimeDeFi's main directory in word doc format. It will be migrated into .sol test contracts and .js test scripts later
