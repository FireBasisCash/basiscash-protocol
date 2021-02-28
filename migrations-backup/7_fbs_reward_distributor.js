const {
  fbsPools,
  INITIAL_FBS_FOR_FBC_USDT,
  INITIAL_FBS_FOR_FBS_USDT,
  INITIAL_FBS_FOR_FBG_USDT,
} = require('./pools');

// Pools
// deployed first
const Share = artifacts.require('Share');
const InitialShareDistributor = artifacts.require('InitialShareDistributor');

// ============ Main Migration ============

async function migration(deployer, network, accounts) {
  const unit = web3.utils.toBN(10 ** 18);
  /**
   * 
  const INITIAL_FBS_FOR_FBC_USDT = 50000;
  const INITIAL_FBS_FOR_FBS_USDT = 50000;
  const INITIAL_FBS_FOR_FBG_USDT = 50000;

   */
  const totalBalanceForUSDTFBC = unit.muln(INITIAL_FBS_FOR_FBC_USDT)
  const totalBalanceForUSDTFBS = unit.muln(INITIAL_FBS_FOR_FBS_USDT)
  const totalBalanceForUSDTFBG = unit.muln(INITIAL_FBS_FOR_FBG_USDT)

  const totalBalance = totalBalanceForUSDTFBC.add(totalBalanceForUSDTFBS).add(totalBalanceForUSDTFBG);

  const share = await Share.deployed();

  const lpPoolFBCUSDT = artifacts.require(fbsPools.FBCUSDT.contractName);
  const lpPoolFBSUSDT = artifacts.require(fbsPools.FBSUSDT.contractName);
  const lpPoolFBGUSDT = artifacts.require(fbsPools.FBGUSDT.contractName);

  await deployer.deploy(
    InitialShareDistributor,
    share.address,
    lpPoolFBCUSDT.address,
    totalBalanceForUSDTFBC.toString(),
    lpPoolFBSUSDT.address,
    totalBalanceForUSDTFBS.toString(),
    lpPoolFBGUSDT.address,
    totalBalanceForUSDTFBG.toString(),
  );
  const distributor = await InitialShareDistributor.deployed();

  await share.mint(distributor.address, totalBalance.toString());
  console.log(`Deposited ${totalBalance} FBS to InitialShareDistributor.`);

  console.log(`Setting distributor to InitialShareDistributor (${distributor.address})`);
  await lpPoolFBCUSDT.deployed().then(pool => pool.setRewardDistribution(distributor.address));
  await lpPoolFBSUSDT.deployed().then(pool => pool.setRewardDistribution(distributor.address));
  await lpPoolFBGUSDT.deployed().then(pool => pool.setRewardDistribution(distributor.address));

  await distributor.distribute();
}

module.exports = migration;
