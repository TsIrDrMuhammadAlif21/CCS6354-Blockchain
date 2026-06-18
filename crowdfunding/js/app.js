let provider;
let signer;
let contract;

document
.getElementById("connectBtn")
.addEventListener("click", connectWallet);

async function connectWallet() {

    if (!window.ethereum) {
        alert("Install MetaMask");
        return;
    }

    await ethereum.request({
        method: "eth_requestAccounts"
    });

    provider =
        new ethers.providers.Web3Provider(
            window.ethereum
        );

    signer =
        provider.getSigner();

    contract =
        new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
        );

    const address =
        await signer.getAddress();

    document.getElementById(
        "walletAddress"
    ).innerText = address;

    loadCampaignInfo();
}

async function loadCampaignInfo() {

    const goal =
        await contract.fundingGoal();

    const raised =
        await contract.totalFunds();

    const deadline =
        await contract.deadline();

    const reached =
        await contract.goalReached();

    document.getElementById("goal")
        .innerText =
        ethers.utils.formatEther(goal);

    document.getElementById("raised")
        .innerText =
        ethers.utils.formatEther(raised);

    document.getElementById("deadline")
        .innerText =
        new Date(
            deadline * 1000
        ).toLocaleString();

    document.getElementById("goalReached")
        .innerText =
        reached ? "Yes" : "No";
}

async function fundCampaign() {

    try {

        document.getElementById(
            "status"
        ).innerText =
        "Pending Transaction...";

        const amount =
            document.getElementById(
                "amount"
            ).value;

        const tx =
            await contract.fund({
                value:
                ethers.utils.parseEther(
                    amount
                )
            });

        await tx.wait();

        document.getElementById(
            "status"
        ).innerText =
        "Donation Successful";

        loadCampaignInfo();

    } catch(error) {

        document.getElementById(
            "status"
        ).innerText =
        error.message;
    }
}

async function withdrawFunds() {

    try {

        document.getElementById(
            "status"
        ).innerText =
        "Pending Transaction...";

        const tx =
            await contract.withdrawFunds();

        await tx.wait();

        document.getElementById(
            "status"
        ).innerText =
        "Withdraw Successful";

    } catch(error) {

        document.getElementById(
            "status"
        ).innerText =
        error.message;
    }
}

async function claimRefund() {

    try {

        document.getElementById(
            "status"
        ).innerText =
        "Pending Transaction...";

        const tx =
            await contract.claimRefund();

        await tx.wait();

        document.getElementById(
            "status"
        ).innerText =
        "Refund Successful";

    } catch(error) {

        document.getElementById(
            "status"
        ).innerText =
        error.message;
    }
}