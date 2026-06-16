const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("CrowdFunding", function () {
  let crowdFunding;
  let admin, creator, backer1, backer2;
  const duration = 7;
  let fundingGoal;

  beforeEach(async function () {
    [admin, creator, backer1, backer2] = await ethers.getSigners();
    fundingGoal = ethers.parseEther("10"); 
    
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    crowdFunding = await CrowdFunding.deploy(fundingGoal, duration, creator.address);
  });

  it("1. Should accept funds and update state correctly", async function () {
    const contribution = ethers.parseEther("5");
    await crowdFunding.connect(backer1).fund({ value: contribution });
    
    expect(await crowdFunding.contributions(backer1.address)).to.equal(contribution);
    expect(await crowdFunding.totalFunds()).to.equal(contribution);
  });

  it("2. Should REVERT if funding occurs after the deadline", async function () {
    // Fast-forward the blockchain time by 8 days
    await time.increase(8 * 24 * 60 * 60); 
    
    await expect(
      crowdFunding.connect(backer1).fund({ value: ethers.parseEther("1") })
    ).to.be.revertedWith("Error: Campaign deadline has passed");
  });

  it("3. Should secure withdrawal via RBAC (Only Creator)", async function () {
    // 1. Fully fund the campaign
    await crowdFunding.connect(backer1).fund({ value: fundingGoal });
    // 2. Fast-forward past the deadline
    await time.increase(8 * 24 * 60 * 60);

    // 3. Verify a random backer CANNOT withdraw
    await expect(
      crowdFunding.connect(backer1).withdrawFunds()
    ).to.be.revertedWithCustomError(crowdFunding, "AccessControlUnauthorizedAccount");

    // 4. Verify the assigned creator CAN withdraw
    await expect(crowdFunding.connect(creator).withdrawFunds())
      .to.emit(crowdFunding, "FundsWithdrawn")
      .withArgs(creator.address, fundingGoal);
  });
});