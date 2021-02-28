// ============ Contracts ============

// Token
// deployed first
const Cash = artifacts.require('Cash')
const Bond = artifacts.require('Bond')
const Share = artifacts.require('Share')
const Governance = artifacts.require('Governance')
const USDT = artifacts.require('USDT')

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([deployToken(deployer, network, accounts)])
}

module.exports = migration

// ============ Deploy Functions ============

async function deployToken(deployer, network, accounts) {
  await deployer.deploy(Cash);
  await deployer.deploy(Bond);
  await deployer.deploy(Share);
  await deployer.deploy(Governance);

  if (network !== 'mainnet') {
    await deployer.deploy(USDT);

    // mint test balance
    const cash = await Cash.deployed();
    const bond = await Bond.deployed();
    const share = await Share.deployed();
    const governance = await Governance.deployed();
    const usdt = await USDT.deployed();
    const fifty_thousand = web3.utils
      .toBN(5 * 10 ** 4)
      .mul(web3.utils.toBN(10 ** 18))

    await Promise.all([
      cash.mint(accounts[0], fifty_thousand.toString(), { from: accounts[0] }),
      bond.mint(accounts[0], fifty_thousand.toString(), { from: accounts[0] }),
      share.mint(accounts[0], fifty_thousand.toString(), { from: accounts[0] }),
      governance.mint(accounts[0], fifty_thousand.toString(), { from: accounts[0] }),
      usdt.mint(accounts[0], fifty_thousand.toString(), { from: accounts[0] }),
    ]);
  }
}
