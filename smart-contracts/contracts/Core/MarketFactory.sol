// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PredictionMarket.sol";

contract MarketFactory is Ownable
{

    address[] public allMarkets;
    event MarketCreated(address indexed marketAddress, address indexed creator, string question, uint256 endTime,PredictionMarket.Category category);

    constructor() Ownable(msg.sender) {}
    function createMarket(
        address token,
        string memory question,
        uint256 duration,
        PredictionMarket.Category category
        
    ) external onlyOwner returns(address){
        
        PredictionMarket market = new PredictionMarket(
            token,
            question,
            duration,
            category,
            owner()
        );
        
        allMarkets.push(address(market));
        
        emit MarketCreated(address(market), msg.sender, question, block.timestamp + duration,category);
        return address(market);
}
    function getAllMarkets() external view returns (address[] memory) {
        return allMarkets;
    }
    function resolveMarket(address marketAddress , PredictionMarket.Outcome outcome)external onlyOwner{
        PredictionMarket(marketAddress).resolveMarket(outcome);
    }
}