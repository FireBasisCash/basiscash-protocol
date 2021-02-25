pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/IDistributor.sol";
import "../interfaces/IRewardDistributionRecipient.sol";

contract InitialShareDistributor is IDistributor {
    using SafeMath for uint256;

    event Distributed(address pool, uint256 cashAmount);

    bool public once = true;

    IERC20 public share;

    IRewardDistributionRecipient usdtfbcLPPool;
    uint256 usdtfbcInitialBalance;

    IRewardDistributionRecipient usdtfbsLPPool;
    uint256 usdtfbsInitialBalance;

    IRewardDistributionRecipient usdtfbgLPPool;
    uint256 usdtfbgInitialBalance;

    constructor(
        IERC20 _share,
        IRewardDistributionRecipient _usdtfbcLPPool,
        uint256 _usdtfbcInitialBalance,
        IRewardDistributionRecipient _usdtfbsLPPool,
        uint256 _usdtfbsInitialBalance,
        IRewardDistributionRecipient _usdtfbgLPPool,
        uint256 _usdtfbgInitialBalance
    ) public {
        share = _share;
        usdtfbcLPPool = _usdtfbcLPPool;
        usdtfbcInitialBalance = _usdtfbcInitialBalance;
        usdtfbsLPPool = _usdtfbsLPPool;
        usdtfbsInitialBalance = _usdtfbsInitialBalance;
        usdtfbgLPPool = _usdtfbgLPPool;
        usdtfbgInitialBalance = _usdtfbgInitialBalance;
    }

    function distribute() public override {
        require(
            once,
            "InitialShareDistributor: you cannot run this function twice"
        );

        share.transfer(address(usdtfbcLPPool), usdtfbcInitialBalance);
        usdtfbcLPPool.notifyRewardAmount(usdtfbcInitialBalance);
        emit Distributed(address(usdtfbcLPPool), usdtfbcInitialBalance);

        share.transfer(address(usdtfbsLPPool), usdtfbsInitialBalance);
        usdtfbsLPPool.notifyRewardAmount(usdtfbsInitialBalance);
        emit Distributed(address(usdtfbsLPPool), usdtfbsInitialBalance);

        share.transfer(address(usdtfbgLPPool), usdtfbgInitialBalance);
        usdtfbgLPPool.notifyRewardAmount(usdtfbgInitialBalance);
        emit Distributed(address(usdtfbgLPPool), usdtfbgInitialBalance);

        once = false;
    }
}
