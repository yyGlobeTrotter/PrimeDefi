# Chainlink Hackathon Fall 2021 DeFi Project -- PrimeDeFi
***

![PrimeDeFi Logo](/client/src/temp.png "PrimeDeFi Project Logo")

## PrimeDeFi DApp Walkthrough DEMO

A screen recording demo walking-through of this DApp can be found here:
[PrimeDeFi DApp v0.1] (https://youtu.be/[XXXXXXX])

## Project Description

PrimeDeFi is our proposed DeFi protocol operating on smart blockchains. PrimeDeFi envisions a decentralized virtual deal room that allows issuers to tokenize debt instruments and automate issuance / book-building processes, and investors to bid to invest in new issuances and manage own wallets, all on blockchain, with real time on-chain settlement and event alert. PrimeDeFi eliminates the need of any traditional middleman (such as 3rd party underwrter, custodian or escrow agent)

### Introduction

This project is an Ethereum Web 3.0 decentralized application (DApp).

It allows XXXXXXXXXX

- Issuers can XXXXXX
- Investors can XXXXXX

### User Stories

Through their dashboards, issuers can add wallet, view/manage wallet/treasury, create/edit issuances, view a list of all issuances, view/monitor individual issuance, view investor list, etc.

[Optional] Issuers also can view/edit their profiles, upload/manage documents, etc.

Through their dashboards, investors can browse through a list of open issuances, check on relevant documents and issuance criteria. select the ones interested and make bids for investments

Investors also can deposit into and withdraw from own wallets, review bid status and final result, and monitor wallet balance

#### Issuer Dashboard

Issuer dashboard is the first page that issuers see after they log into PrimeDeFi DApp, from a Web3 enabled browser. It displays everything related to:

- Issuer profile
- A list of past and open issuances from this issuer, and account alert/reminder if any
- Details of each issuance after they click on the relevant link
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

### Technical Requirements to Run the Project Locally

- Truffle v[X] (core: [X])
- Solidity - [X] (solc-js)
- Node v[X]
- [etc etc etc]

### To Compile and Test Solidity Contract Locally

1. Navigate to the root directory
2. Run `yarn install` for OpenZepplin dependencies
3. Run `truffle compile`
4. Run `truffle test`

### To Run this DApp from a Web3-enabled Browser and connect with a Blockchain Testnet

*MetaMask is required to connect this project to a Web3-enabled browser*
*An INFURA Project ID is required to connect this project to the Ethereum networks such as Rinkeby Testnet*

Frontend is connected to the contract deployed to **Kovan** Testnet, address `0x[xxxxxxxx......]`

1. Create a `.env` file and save it in the project root directory
2. The format of the `env` file should look like this:
  INFURA_PROJECT_ID=<*Your own project id*>
  MNEMONIC="<*Your own 12-words MetaMask mnemonic*>"
3. Navigate to `/client` folder
4. Run `yarn install` or `npm install` to install all client-side dependencies such as a local lite-server.
5. Run `yarn start` or `npm run start` to start the server, it will automatically open up a browser page.
6. Follow the directions on User Dashboard to run through different actions and see results

## Tools/Libraries Used to Build/Test this Project

- **Solidity** is used to write the smart contract sitting in the backend
- ......
- **Chainlink** is used as off-chain Oracle market data provider
- ......

## Unit Tests (*Solidity and JavaScript tests*)
