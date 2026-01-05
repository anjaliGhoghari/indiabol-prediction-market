// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PredictionMarket is Ownable, ReentrancyGuard {
    enum MarketState {
        CREATED,
        OPEN,
        CLOSED,
        RESOLVED
    }
    enum Outcome {
        NONE,
        YES,
        NO
    }
    enum Category {
        CRICKET,
        IPL_SPORTS,
        BOLLYWOOD,
        OTT_ENTERTAINMENT,
        POLITICS,
        CURRENT_AFFAIRS,
        STOCK_MARKET,
        CRYPTO,
        GOLD_ECONOMY,
        TECHNOLOGY,
        SPACE,
        GLOBAL_POLITICS
    }
    IERC20 public immutable token;

    string public question;
    uint256 public endTime;
    Category public category;
    MarketState public state;
    Outcome public winningOutcome;
    mapping(address => mapping(Outcome => uint256)) public userStakes;
    uint256 public totalYesStakes;
    uint256 public totalNoStakes;
    mapping(address => bool) public hasClaimed;
    uint256 public platformFeeBps = 200;
    uint256 public totalPlatformFees;
    mapping(address => uint256) public totalRewardClaimed;
    address public feeRecipient;

    event MarketOpened();
    event MarketPlaced(address indexed user, Outcome outcome, uint256 amount);
    event MarketClosed();
    event MarketResolved(Outcome winningOutcome);
    event RewardsClaimed(
    address indexed user,
    uint256 userAmount,
    uint256 platformFee
);
    constructor(
        address _Token,
        string memory _question,
        uint256 _duration,
        Category _category,
        address _feeRecipient
    ) Ownable(msg.sender) {
        token = IERC20(_Token);
        question = _question;
        endTime = block.timestamp + _duration;
        category = _category;
        state = MarketState.CREATED;
        state = MarketState.OPEN;
        feeRecipient = _feeRecipient;
    }
    function openMarket() external onlyOwner {
        require(state == MarketState.CREATED, "Market already opened");
        state = MarketState.OPEN;
        emit MarketOpened();
    }
    function placePrediction(
        Outcome _outcome,
        uint256 _amount
    ) external nonReentrant {
        require(state == MarketState.OPEN, "Market not open yet");
        require(block.timestamp < endTime, "Market has ended");
        require(
            _outcome == Outcome.YES || _outcome == Outcome.NO,
            "Invalid outcome"
        );
        require(_amount > 0, "Amount must be more then 0 ");

        token.transferFrom(msg.sender, address(this), _amount);
        userStakes[msg.sender][_outcome] += _amount;
        if (_outcome == Outcome.YES) {
            totalYesStakes += _amount;
        } else {
            totalNoStakes += _amount;
        }
        emit MarketPlaced(msg.sender, _outcome, _amount);
    }
    function closeMarket() external {
        require(state == MarketState.OPEN, "Market not open");
        require(block.timestamp >= endTime, "Market duration not yet ended");
        state = MarketState.CLOSED;
        emit MarketClosed();
    }
    function resolveMarket(Outcome _winningOutcome) external onlyOwner {
        require(state == MarketState.CLOSED, "Market not closed yet");
        require(
            _winningOutcome == Outcome.YES || _winningOutcome == Outcome.NO,
            "Invalid outcome"
        );
        winningOutcome = _winningOutcome;
        state = MarketState.RESOLVED;
        emit MarketResolved(_winningOutcome);
    }
    function getWinningPool() public view returns (uint256) {
        if (winningOutcome == Outcome.YES) {
            return totalYesStakes;
        } else if (winningOutcome == Outcome.NO) {
            return totalNoStakes;
        } else {
            return 0;
        }
    }
    function getTotalPool() public view returns (uint256) {
        return totalYesStakes + totalNoStakes;
    }
    function claimRewards() external nonReentrant {
        require(state == MarketState.RESOLVED, "Market not resolved yet");
        require(!hasClaimed[msg.sender], "Rewards already claimed");
        uint256 userStake = userStakes[msg.sender][winningOutcome];
        require(userStake > 0, "No winning stake to claim");
        uint256 winningPool = getWinningPool();
        uint256 totalPool = getTotalPool();
        uint256 reward = (userStake * totalPool) / winningPool;
        hasClaimed[msg.sender] = true;
        uint256 fee = (reward * platformFeeBps) / 1000;
        uint256 userAmount = reward - fee;
        totalPlatformFees += fee;
        totalRewardClaimed[msg.sender] += userAmount;
        token.transfer(msg.sender, userAmount);
        token.transfer(feeRecipient, fee);
        emit RewardsClaimed(msg.sender, userAmount, fee);
        
        
    }
}
