// // This setup uses Hardhat Ignition to manage smart contract deployments.
// // Learn more about it at https://v2.hardhat.org/ignition

// const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// const JAN_1ST_2030 = 1893456000;
// const ONE_GWEI = 1_000_000_000n;

// module.exports = buildModule("LockModule", (m) => {
//   const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
//   const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);

//   const lock = m.contract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   return { lock };
// });

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CrowdFundingModule", (m) => {
  // Define our constructor parameters
  // Setting the goal to 5 ETH and duration to 30 days for the live testnet
  const targetGoal = m.getParameter("goal", 5000000000000000000n); // 5 ETH in Wei
  const durationInDays = m.getParameter("duration", 30);

  // Deploy the contract with the parameters
  const crowdfunding = m.contract("CrowdFunding", [targetGoal, durationInDays]);

  return { crowdfunding };
});