const knownContracts = require('./known-contracts');

const Cash = artifacts.require('Cash');
const Share = artifacts.require('Share');
const Oracle = artifacts.require('Oracle');
const Governance = artifacts.require('Governance');
const IERC20 = artifacts.require('IERC20');

const FBCUSDTLPToken_BASPool = artifacts.require('FBCUSDTLPTokenSharePool')
const FBSUSDTLPToken_BASPool = artifacts.require('FBSUSDTLPTokenSharePool')
const FBGUSDTLPToken_BASPool = artifacts.require('FBGUSDTLPTokenSharePool')

const UniswapV2Factory = artifacts.require('UniswapV2Factory');

module.exports = async (deployer, network, accounts) => {
  const uniswapFactory = network === 'mainnet'
    ? await UniswapV2Factory.at(knownContracts.UniswapV2Factory[network])
    : await UniswapV2Factory.deployed();

  const oracle = await Oracle.deployed();
  const usdt = network=="mainnet"?IERC20.at(knownContracts.USDT[network]):await USDT.deployed();

  const usdt_fbc_lpt = await oracle.pairFor(uniswapFactory.address, Cash.address, usdt.address);
  const usdt_fbs_lpt = await oracle.pairFor(uniswapFactory.address, Share.address, usdt.address);
  const usdt_fbg_lpt = await oracle.pairFor(uniswapFactory.address, Governance.address, usdt.address);

  await deployer.deploy(FBCUSDTLPToken_BASPool, Share.address, usdt_fbc_lpt);
  await deployer.deploy(FBSUSDTLPToken_BASPool, Share.address, usdt_fbs_lpt);
  await deployer.deploy(FBGUSDTLPToken_BASPool, Share.address, usdt_fbg_lpt);

  console.log(`Setting distributor to ${accounts[0]}`);
  await Promise.all(
    [
      await FBCUSDTLPToken_BASPool.deployed(),
      await FBSUSDTLPToken_BASPool.deployed(),
      await FBGUSDTLPToken_BASPool.deployed(),
    ].map(pool => pool.setRewardDistribution(accounts[0])),
  );
};
