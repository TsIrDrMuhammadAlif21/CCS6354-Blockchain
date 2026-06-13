CrowdFunding Blockchain Project
This project uses Hardhat v2 and OpenZeppelin v5 for secure, decentralized crowdfunding operations.

Prerequisites
Ensure you have Node.js (LTS version) installed on your machine.

Getting Started
Follow these steps to set up the project on your local machine:

1. Clone the Repository

git clone https://github.com/TsIrDrMuhammadAlif21/CCS6354-Blockchain
cd CCS6354-Blockchain

2. Install Dependencies
This project uses a clean dependency tree. Run the following command to install all necessary packages:

npm install

3. Environment Configuration
Create a .env file in the root directory. You can use the following template to store your environment variables:

PRIVATE_KEY=your_private_key_here
RPC_URL=your_rpc_url_here

4. Running the Project
The following commands are available for your workflow:

Compile the Contracts:

npx hardhat compile
npx hardhat test


Technical Architecture
Engine: Hardhat v2.22.14

Compiler: Solidity 0.8.20

Standard: CommonJS (No ESM strict-mode)

Security: OpenZeppelin v5 (ReentrancyGuard, AccessControl)

Troubleshooting
If you encounter Cannot read properties of undefined errors, ensure you are running npm install after pulling the latest changes from the repository. This guarantees that your node_modules are synchronized with the package.json lockfile.