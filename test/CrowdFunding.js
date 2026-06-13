const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("CrowdFunding", function () {
  let crowdFunding;
  let admin, creator, backer1, backer2;
  const duration = 7;

  beforeEach(async function () {
    [admin, creator, backer1, backer2] = await ethers.getSigners();
    const fundingGoal = ethers.parseEther("10"); 
    
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    crowdFunding = await CrowdFunding.deploy(fundingGoal, duration, creator.address);
  });

  it("Should accept funds and update state", async function () {
    const contribution = ethers.parseEther("5");
    await crowdFunding.connect(backer1).fund({ value: contribution });
    
    expect(await crowdFunding.contributions(backer1.address)).to.equal(contribution);
    expect(await crowdFunding.totalFunds()).to.equal(contribution);
  });
});