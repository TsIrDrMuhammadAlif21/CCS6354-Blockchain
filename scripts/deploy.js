const hre = require("hardhat");

async function main() {
  const fundingGoal = hre.ethers.parseEther("10"); // 10 ETH goal
  const durationInDays = 7; // 7 days

  const [deployer] = await hre.ethers.getSigners();
  console.log("Initiating deployment from account:", deployer.address);

  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const crowdFunding = await CrowdFunding.deploy(fundingGoal, durationInDays, deployer.address);
  
  await crowdFunding.waitForDeployment();

  console.log("==========================================");
  console.log("SUCCESS: CrowdFunding deployed to:", await crowdFunding.getAddress());
  console.log("==========================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});