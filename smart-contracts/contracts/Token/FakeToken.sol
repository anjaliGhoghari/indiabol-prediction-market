// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";


contract FakeToken is ERC20, Ownable, Pausable {
    uint256 public faucetAmount;
uint256 public faucetCooldown;
mapping(address => uint256) public lastFaucetClaim;
event FaucetClaimed(address indexed user, uint256 amount);

    constructor() ERC20("Prediction Token", "PRED") Ownable(msg.sender) {
    faucetAmount = 1000 * 10 ** decimals();
    faucetCooldown = 1 days;
}
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    function claimFaucet() external whenNotPaused {
    require(
        lastFaucetClaim[msg.sender] == 0 ||
        block.timestamp >= lastFaucetClaim[msg.sender] + faucetCooldown,
        "Faucet: cooldown not finished"
    );

    lastFaucetClaim[msg.sender] = block.timestamp;

    _mint(msg.sender, faucetAmount);

    emit FaucetClaimed(msg.sender, faucetAmount);
}

function pause() external onlyOwner {
    _pause();
}

function unpause() external onlyOwner {
    _unpause();
}
}
