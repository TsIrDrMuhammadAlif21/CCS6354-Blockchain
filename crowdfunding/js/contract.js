const CONTRACT_ADDRESS =
"0x5FbDB2315678afecb367f032d93F642f64180aa3";

const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "fund",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimRefund",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fundingGoal",
        "outputs": [{"type":"uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalFunds",
        "outputs": [{"type":"uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deadline",
        "outputs": [{"type":"uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "goalReached",
        "outputs": [{"type":"bool"}],
        "stateMutability": "view",
        "type": "function"
    }
];