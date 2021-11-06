# PrimeDeFi Client

The code within this folder contain the Frontend implementation for the PrimeDeFi dApps. This project is React based and utilize several libraries, including but not limited to Chakra UI, Moralis, and Material UI. Happy BUIDL!

---

## Table of Contents

- [Pre-requisites](https://github.com/Web3-Hackers/PrimeDefi/tree/initial-fe-setup/client#table-of-contents)
   - [Node.js](https://github.com/Web3-Hackers/PrimeDefi/tree/initial-fe-setup/client#1-nodejs)
   - [NPM/Yarn](https://github.com/Web3-Hackers/PrimeDefi/tree/initial-fe-setup/client#2-npmyarn)
   - [Moralis Admin Account](https://github.com/Web3-Hackers/PrimeDefi/tree/initial-fe-setup/client#3-moralis-admin-account)
- [Getting Started](https://github.com/Web3-Hackers/PrimeDefi/tree/initial-fe-setup/client#getting-started)
   - [Clone the Project](https://github.com/Web3-Hackers/PrimeDefi/tree/initial-fe-setup/client#1-clone-the-project)
   - [Install Dependencies](https://github.com/Web3-Hackers/PrimeDefi/tree/initial-fe-setup/client#2-install-dependencies)
   - [Add Environment Variables](https://github.com/Web3-Hackers/PrimeDefi/tree/initial-fe-setup/client#3-add-environment-variables)
   - [Run the Project](https://github.com/Web3-Hackers/PrimeDefi/tree/initial-fe-setup/client#4-run-the-project)
- [Production](https://github.com/Web3-Hackers/PrimeDefi/tree/initial-fe-setup/client#production)
---

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

#### 3. Moralis Admin Account

If you have not signed up to Moralis yet, click [here](https://admin.moralis.io/register) to register and get your free Moralis Admin account in just a few minutes!

---

### Getting Started

#### 1. Clone the project

```bash
# Git
git clone https://github.com/Web3-Hackers/PrimeDefi.git

# GitHub CLI
gh repo clone Web3-Hackers/PrimeDefi
```

#### 2. Install Dependencies

```bash
# NPM
npm i

# Yarn
yarn
```

#### 3. Add Environment Variables

Copy `.env.example` and rename it as `.env`, then fill in the following information.

```
REACT_APP_MORALIS_APP_ID=xxx
REACT_APP_MORALIS_SERVER_URL=xxx
```

#### 4. Run the Project

```bash
# NPM
npm run start

# Yarn
yarn start
```

---

### Production

To use the code for production, compile the build version and run the following command.

```bash
# NPM
npm run build

# Yarn
yarn build
```

Once the building process is completed (whether locally or remotely in CI/CD), deploy the build version to your favorite hosting service.