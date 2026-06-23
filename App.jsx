import { useState, useEffect } from "react";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import abi from "./abi.json";
import "./App.css";

const CONTRACT_ADDRESS =
  "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [creator, setCreator] = useState("");

  const [goal, setGoal] = useState("0");
  const [raised, setRaised] = useState("0");
  const [deadline, setDeadline] = useState("");
  const [goalReached, setGoalReached] = useState(false);

  const [donationAmount, setDonationAmount] = useState("");
  const [status, setStatus] = useState("Ready");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);

      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();

      const address = await signer.getAddress();

      const crowdfundingContract = new Contract(
        CONTRACT_ADDRESS,
        abi,
        signer
      );

      setAccount(address);
      setContract(crowdfundingContract);

      loadContractData(crowdfundingContract);

      setStatus("Wallet Connected");
    } catch (error) {
      console.error(error);
      setStatus("Connection Failed");
    }
  };

 const loadContractData = async (crowdfundingContract) => {
  try {
    const campaignGoal = await crowdfundingContract.goal();
    const raisedFunds = await crowdfundingContract.totalFunds();
    const campaignDeadline = await crowdfundingContract.deadline();
    const creatorAddress = await crowdfundingContract.creator();

  
setCreator(creatorAddress);

    setGoal(formatEther(campaignGoal));
    setRaised(formatEther(raisedFunds));

    setDeadline(
      new Date(Number(campaignDeadline) * 1000).toLocaleString()
    );
      const reached =
      Number(formatEther(raisedFunds))
      >=
      Number(formatEther(campaignGoal));

    setGoalReached(reached);

  } catch (error) {
    console.error(error);
  }
};

  const donate = async () => {
    try {
      if (!contract) return;

      setStatus("Waiting for MetaMask...");

      const tx = await contract.fund(
        "Donation from React Frontend",
        {
          value: parseEther(donationAmount)
        }
      );

      setStatus("Transaction Pending...");

      await tx.wait();

      setStatus("Donation Successful");

      loadContractData(contract);

    } catch (error) {
      console.error(error);
      setStatus(error.shortMessage || error.message);
    }
  };
  const withdraw = async () => {
    try {
      setStatus("Waiting for MetaMask...");

      const tx = await contract.withdraw();

      setStatus("Transaction Pending...");

      await tx.wait();

      setStatus("Funds Withdrawn");

      loadContractData(contract);
    } catch (error) {
      console.error(error);
      setStatus(error.reason || error.message);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  const isCreator =
  account &&
  creator &&
  account.toLowerCase() === creator.toLowerCase();

  return (
  <div className="container">

    <div className="header">
      <h1>🚀 CrowdFunding Platform</h1>
      <p>
        Decentralized Crowdfunding powered by Ethereum
      </p>
    </div>

    <div className="wallet-card">
      <button
        className="connect-btn"
        onClick={connectWallet}
      >
        Connect MetaMask
      </button>

      <p className="wallet-address">
        {account || "Wallet Not Connected"}
      </p>
    </div>

    <div className="dashboard">

      <div className="main-card">

        <h2>Orphan Funds Raising Campaign</h2>

        <div className="stat-row">
          <span>Funding Goal</span>
          <strong>{goal} ETH</strong>
        </div>

        <div className="stat-row">
          <span>Raised</span>
          <strong>{raised} ETH</strong>
        </div>

        <div className="stat-row">
          <span>Deadline</span>
          <strong>{deadline}</strong>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${
                goal > 0
                  ? (raised / goal) * 100
                  : 0
              }%`
            }}
          />
        </div>

        <p>
          Goal Reached:
          {goalReached
            ? " ✅ Yes"
            : " ❌ No"}
        </p>

      </div>

      <div className="side-card">

        <h3>Support Campaign</h3>

        <div className="donate-section">

          <input
            type="number"
            placeholder="Amount in ETH"
            value={donationAmount}
            onChange={(e)=>
              setDonationAmount(e.target.value)
            }
          />

          <button
            className="donate-btn"
            onClick={donate}
          >
            Donate
          </button>

          <br /><br />

          {isCreator && (
          <button
            className="withdraw-btn"
            onClick={withdraw}
          >
            Withdraw Funds
          </button>
        )}

          <br /><br />

          <div className="status-box">
            {status}
          </div>

        </div>

      </div>

    </div>

  </div>
);
}

export default App;