// https://docs.basis.cash/mechanisms/yield-farming
const INITIAL_FBC_FOR_POOLS = 12500;
const INITIAL_FBS_FOR_FBC_USDT = 50000;
const INITIAL_FBS_FOR_FBS_USDT = 50000;
const INITIAL_FBS_FOR_FBG_USDT = 50000;


const POOL_START_DATE = Date.parse('2021-02-25T00:00:00Z');

const fbcPools = [
  { contractName: 'FBGCashPool', token: 'FBG' },
];

const fbsPools = {
  FBCUSDT: { contractName: 'FBCUSDTLPTokenSharePool', token: 'FBC_USDT-LP' },
  FBSUSDT: { contractName: 'FBSUSDTLPTokenSharePool', token: 'FBS_USDT-LP' },
  FBGUSDT: { contractName: 'FBGUSDTLPTokenSharePool', token: 'FBG_USDT-LP' },

}

module.exports = {
  INITIAL_FBC_FOR_POOLS,
  INITIAL_FBS_FOR_FBC_USDT,
  INITIAL_FBS_FOR_FBS_USDT,
  INITIAL_FBS_FOR_FBG_USDT,
  fbcPools,
  fbsPools,
};
