<!DOCTYPE html>
<html>

<head>
    <title>CrowdFunding DApp</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <link rel="stylesheet" href="css/style.css">

    <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
</head>

<body>

<div class="container mt-5">

    <h1 class="text-center mb-4">
        Decentralized Crowdfunding Platform
    </h1>

    <div class="card p-3 mb-3">

        <button id="connectBtn"
                class="btn btn-primary">
            Connect MetaMask
        </button>

        <p class="mt-2">
            Wallet:
            <span id="walletAddress">
                Not Connected
            </span>
        </p>

    </div>

    <div class="card p-3 mb-3">

        <h3>Campaign Information</h3>

        <p>
            Goal:
            <span id="goal"></span>
            ETH
        </p>

        <p>
            Raised:
            <span id="raised"></span>
            ETH
        </p>

        <p>
            Deadline:
            <span id="deadline"></span>
        </p>

        <p>
            Goal Reached:
            <span id="goalReached"></span>
        </p>

    </div>

    <div class="card p-3 mb-3">

        <h3>Donate</h3>

        <input
            type="number"
            step="0.01"
            id="amount"
            class="form-control"
            placeholder="ETH Amount">

        <button
            onclick="fundCampaign()"
            class="btn btn-success mt-2">
            Donate
        </button>

    </div>

    <div class="card p-3 mb-3">

        <h3>Creator Actions</h3>

        <button
            onclick="withdrawFunds()"
            class="btn btn-warning">
            Withdraw Funds
        </button>

    </div>

    <div class="card p-3 mb-3">

        <h3>Contributor Actions</h3>

        <button
            onclick="claimRefund()"
            class="btn btn-danger">
            Claim Refund
        </button>

    </div>

    <div class="card p-3">

        <h3>Transaction Status</h3>

        <p id="status">
            Ready
        </p>

    </div>

</div>

<script src="js/contract.js"></script>
<script src="js/app.js"></script>

</body>
</html>