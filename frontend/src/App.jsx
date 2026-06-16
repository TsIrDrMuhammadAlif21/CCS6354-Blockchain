// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "./abi.json"; // The ABI you handed off

// The exact address from your local Hardhat deployment
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

function App() {
  // --- UI STATE VARIABLES ---
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [totalFunds, setTotalFunds] = useState("0");
  const [goal, setGoal] = useState("0");
  const [fundAmount, setFundAmount] = useState("");

  // --- READ-ONLY BACKGROUND CONNECTION ---
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        // Connect directly to the Hardhat node as a "guest" (No MetaMask required)
        const readOnlyProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        
        // Connect to the contract using the guest provider
        const readOnlyContract = new ethers.Contract(
          CONTRACT_ADDRESS, 
          contractABI.abi, 
          readOnlyProvider
        );

        // Fetch the public data
        const currentFunds = await readOnlyContract.totalFunds();
        setTotalFunds(ethers.formatEther(currentFunds));
        
      } catch (error) {
        console.error("Background connection failed. Is the Hardhat node running?", error);
      }
    };

    fetchPublicData();
  }, []); // The empty brackets [] mean this runs exactly once when the page loads.
  
  // --- WEB3 CONNECTION LOGIC ---
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Connect to MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        // Connect to the Smart Contract
        const crowdFundingContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI.abi,
          signer
        );
        setContract(crowdFundingContract);

        // Fetch initial data
        fetchCampaignData(crowdFundingContract);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // --- READ BLOCKCHAIN DATA ---
  const fetchCampaignData = async (connectedContract) => {
    try {
      const currentFunds = await connectedContract.totalFunds();
      // NOTE: Replace 'fundingGoal' with the exact variable name from your Solidity contract if it's public
      // const campaignGoal = await connectedContract.fundingGoal(); 
      
      setTotalFunds(ethers.formatEther(currentFunds));
      // setGoal(ethers.formatEther(campaignGoal)); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // --- WRITE BLOCKCHAIN DATA (INPUTS) ---
  const handleFund = async (e) => {
    e.preventDefault();
    if (!contract || !fundAmount) return;

    try {
      const amountInWei = ethers.parseEther(fundAmount);
      const tx = await contract.fund({ value: amountInWei });
      
      alert("Transaction sent! Waiting for confirmation...");
      await tx.wait(); // Wait for block verification
      
      alert("Funding successful!");
      fetchCampaignData(contract); // Refresh the UI data
      setFundAmount(""); // Clear the input box
    } catch (error) {
      console.error("Funding failed:", error);
      alert("Error: Check console or ensure deadline hasn't passed.");
    }
  };

  const handleWithdraw = async () => {
    if (!contract) return;
    try {
      const tx = await contract.withdrawFunds();
      await tx.wait();
      alert("Withdrawal successful!");
      fetchCampaignData(contract);
    } catch (error) {
      console.error("Withdrawal failed:", error);
      alert("Withdrawal failed! You might not be the Creator, or time hasn't passed.");
    }
  };

  // --- UI RENDER (TEAMMATE CAN STYLE THIS) ---
  return (
    <main>
      {/* HEADER SECTION */}
      <header>
        <h1>Decentralized CrowdFunding</h1>
        {!account ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <p>Connected: {account.substring(0, 6)}...{account.substring(38)}</p>
        )}
      </header>

      {/* CAMPAIGN STATS SECTION */}
      <section>
        <h2>Campaign Status</h2>
        <p>Total Raised: {totalFunds} ETH</p>
        {/* <p>Goal: {goal} ETH</p> */}
      </section>

      {/* FUNDING INPUT SECTION */}
      <section>
        <h2>Support the Campaign</h2>
        <form onSubmit={handleFund}>
          <input 
            type="number" 
            step="0.01" 
            placeholder="Amount in ETH" 
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
          />
          <button type="submit">Send Funds</button>
        </form>
      </section>

      {/* CREATOR ADMIN SECTION */}
      <section>
        <h2>Creator Panel</h2>
        <p>Only the campaign creator can withdraw after the deadline.</p>
        <button onClick={handleWithdraw}>Withdraw Funds</button>
      </section>
    </main>
  );
}

export default App;