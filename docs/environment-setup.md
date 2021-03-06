# Environment Setup

## Table of Contents

[Prerequisites:](#prerequisites)

- [Install WSL2 on Window](#install-wsl2-on-window)
- [Install pnpm](#install-pnpm)

[Start the Frontend development server:](#Start-the-Frontend-development-server:)
- [Instal project dependencies](#install-project-dependencies)

<hr>

## Prerequisites:

- [Node.js](https://nodejs.org/en/download/)
- [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Install WSL2 on Window

Follow Microsoft WSL2 [installation guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to complete the installation. Suggest to run the following commands once in the WSL2 environment.

```bash
# fetch updated packages information
sudo apt update
# upgrade or install outdated packages
sudo apt upgrade
```

Install [Node, nvm and npm for WSL2](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl#install-nvm-nodejs-and-npm), so as to be able to use `Node` and `npm` in the subsystem. Then finally run the `start` script


### Install pnpm

We use `pnpm` as our package manager. 
Learn more about [pnpm](https://pnpm.io/motivation)

Installing `pnpm` globally:

```bash
npm install -g pnpm
```

<hr>

## Start the Frontend development server

### Install project dependencies

To install all of the dependencies

```bash
pnpm install
```

To run the project on your local machine

```bash
pnpm run start
```

