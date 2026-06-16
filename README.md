# Decentralized Crowdfunding Platform

This project is a full-stack Web3 application demonstrating decentralized fundraising using Solidity, Hardhat, Ethers.js, and React. It features role-based access control (Creator vs. Backer), time-locked smart contracts, and real-time state synchronization via a local EVM.

## System Architecture
* **Smart Contract Engine:** Solidity & Hardhat
* **Frontend Interface:** React.js (Vite) & Tailwind CSS/Standard CSS
* **Web3 Bridge:** Ethers.js (v6)
* **Wallet Provider:** MetaMask

---

## Standard Operating Procedure (Local Setup)

To run this full-stack application locally, you must operate three separate terminals simultaneously.

### Terminal : Boot the Local Blockchain
Start the local Hardhat node to simulate the Ethereum network:
```bash

npx hardhat test

npx hardhat node

npx hardhat run scripts/deploy.js --network localhost

cd frontend
npm run dev

Time_Travel

npx hardhat console --network localhost

await network.provider.send("evm_increaseTime", [8 * 24 * 60 * 60])

await network.provider.send("evm_mine")

.exit