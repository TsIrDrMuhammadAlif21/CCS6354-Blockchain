// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Decentralized Crowdfunding
 * @dev Implements a secure, target-based crowdfunding campaign with RBAC.
 */
contract CrowdFunding is ReentrancyGuard, AccessControl {
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

    uint256 public immutable fundingGoal;
    uint256 public deadline;
    uint256 public totalFunds;
    bool public goalReached;
    bool public isFinalized;

    mapping(address => uint256) public contributions;

    event Funded(address indexed contributor, uint256 amount, uint256 currentTotal);
    event GoalReached(uint256 finalTotal);
    event FundsWithdrawn(address indexed creator, uint256 amount);
    event RefundIssued(address indexed contributor, uint256 amount);

    constructor(uint256 _fundingGoalInWei, uint256 _durationInDays, address _creator) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CREATOR_ROLE, _creator);

        fundingGoal = _fundingGoalInWei;
        deadline = block.timestamp + (_durationInDays * 1 days);
    }

    function fund() external payable {
        require(block.timestamp < deadline, "Error: Campaign deadline has passed");
        require(msg.value > 0, "Contribution must be greater than zero");
        
        contributions[msg.sender] += msg.value;
        totalFunds += msg.value;
        
        emit Funded(msg.sender, msg.value, totalFunds);
        
        if (totalFunds >= fundingGoal && !goalReached) {
            goalReached = true;
            emit GoalReached(totalFunds);
        }
    }

    function withdrawFunds() external onlyRole(CREATOR_ROLE) nonReentrant {
        require(block.timestamp >= deadline, "Error: Campaign is active");
        require(goalReached, "Cannot withdraw: Goal not reached");
        require(!isFinalized, "Cannot withdraw: Already finalized");
        
        isFinalized = true;
        uint256 amountToTransfer = totalFunds;
        
        totalFunds = 0; 
        
        (bool success, ) = msg.sender.call{value: amountToTransfer}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(msg.sender, amountToTransfer);
    }

    function claimRefund() external nonReentrant {
        require(block.timestamp >= deadline, "Error: Campaign is active");
        require(!goalReached, "Refund unavailable: Goal was reached");
        
        uint256 contributedAmount = contributions[msg.sender];
        require(contributedAmount > 0, "Error: No contributions found");
        
        contributions[msg.sender] = 0; 
        
        (bool success, ) = msg.sender.call{value: contributedAmount}("");
        require(success, "Refund transfer failed");
        
        emit RefundIssued(msg.sender, contributedAmount);
    }
}