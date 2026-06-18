const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Decentralized Crowdfunding Platform Proving Grounds", function () {
  async function deployFixture() {
    // Get signers (wallets)
    const [owner, funder] = await ethers.getSigners();

    // Define constructor inputs
    // 10 ETH target goal converted to Wei
    const targetGoal = ethers.parseEther("10"); 
    const durationInDays = 30;

    // Get contract factory
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    
    // Deploy contract passing the required arguments
    const crowdfunding = await CrowdFunding.deploy(targetGoal, durationInDays); 

    return { crowdfunding, owner, funder, targetGoal };
  }

  describe("Deployment Verification", function () {
    it("Should correctly assign the creator role", async function () {
      const { crowdfunding, owner } = await deployFixture();
      expect(await crowdfunding.creator()).to.equal(owner.address);
    });

    it("Should establish the correct target goal", async function () {
      const { crowdfunding, targetGoal } = await deployFixture();
      expect(await crowdfunding.goal()).to.equal(targetGoal);
    });
  });

  describe("Funding Operations", function () {
    it("Should accept contributions and track them accurately", async function () {
      const { crowdfunding, funder } = await deployFixture();
      const contributionAmount = ethers.parseEther("1.5");

      // Fund the campaign from the funder's wallet
      await crowdfunding.connect(funder).fund("Salute from a supporter!", { value: contributionAmount });

      // Verify state updates
      expect(await crowdfunding.totalFunds()).to.equal(contributionAmount);
      expect(await crowdfunding.contributions(funder.address)).to.equal(contributionAmount);
    });

    it("Should block zero-value contributions", async function () {
      const { crowdfunding, funder } = await deployFixture();
      
      // Attempting to fund with 0 Wei should trigger Custom Error: InvalidAmount()
      await expect(
        crowdfunding.connect(funder).fund("Zero funds", { value: 0 })
      ).to.be.revertedWithCustomError(crowdfunding, "InvalidAmount");
    });
  });
});