// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

/// @title Decentralized Crowdfunding Platform
/// @notice A time-locked, secure crowdfunding vault for Final Year Project demonstration
/// @dev Implements RBAC, Reentrancy Guards, and CEI patterns.
contract CrowdFunding {

    // --- GAS OPTIMIZATION: Custom Errors ---
    // Using custom errors instead of require("string") saves significant gas during deployment and execution.
    error Unauthorized();
    error GoalNotReached();
    error DeadlineNotPassed();
    error DeadlinePassed();
    error TransferFailed();
    error InvalidAmount();

    // --- STATE VARIABLES ---
    // GAS OPTIMIZATION: 'immutable' variables are embedded directly into the contract bytecode, saving storage gas.
    address public immutable creator;
    uint256 public immutable goal;
    uint256 public immutable deadline;

    uint256 public totalFunds;
    mapping(address => uint256) public contributions;

    // SECURITY: Custom Reentrancy Guard State Variables
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    // --- EVENTS ---
    event Funded(address indexed backer, uint256 amount, string message);
    event FundsWithdrawn(address indexed creator, uint256 amount);

    // --- SECURITY MODIFIERS ---

    // SECURITY: Role-Based Access Control (RBAC)
    modifier onlyCreator() {
        if (msg.sender != creator) revert Unauthorized();
        _;
    }

    // SECURITY: Reentrancy Guard Modifier
    // Prevents malicious contracts from repeatedly calling withdraw() before the state updates.
    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    /// @notice Initializes the crowdfunding campaign
    /// @param _goal The funding goal in wei
    /// @param _durationInDays How long the campaign lasts
    constructor(uint256 _goal, uint256 _durationInDays) {
        creator = msg.sender;
        goal = _goal;
        deadline = block.timestamp + (_durationInDays * 1 days);
        _status = _NOT_ENTERED; // Initialize reentrancy guard
    }

    /// @notice Allows users to fund the campaign
    /// @param _message A support message. 
    /// GAS OPTIMIZATION: 'calldata' is used instead of 'memory' for external string inputs to save gas.
    function fund(string calldata _message) external payable {
        if (block.timestamp >= deadline) revert DeadlinePassed();
        if (msg.value == 0) revert InvalidAmount();

        contributions[msg.sender] += msg.value;
        totalFunds += msg.value;

        emit Funded(msg.sender, msg.value, _message);
    }

    /// @notice Allows the creator to withdraw funds after the deadline if the goal is met
    // SECURITY: RBAC (onlyCreator) and ReentrancyGuard (nonReentrant) applied here.
    function withdraw() external onlyCreator nonReentrant {
        
        // SECURITY: Checks-Effects-Interactions (CEI) Pattern Implementation

        // 1. CHECKS (Verify conditions)
        if (block.timestamp < deadline) revert DeadlineNotPassed();
        if (totalFunds < goal) revert GoalNotReached();

        // 2. EFFECTS (Update state BEFORE sending money)
        uint256 amountToWithdraw = totalFunds;
        totalFunds = 0; 

        // 3. INTERACTIONS (Send the ether)
        (bool success, ) = payable(creator).call{value: amountToWithdraw}("");
        if (!success) revert TransferFailed();

        emit FundsWithdrawn(creator, amountToWithdraw);
    }
}