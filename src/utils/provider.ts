import { getNetwork } from '@ethersproject/networks';
import { providers } from 'ethers';

const network = getNetwork(parseInt(process.env.CHAIN_ID ?? '56'));
const provider =
    network.name === 'bnb'
        ? new providers.JsonRpcProvider('https://bsc-dataseed1.ninicoin.io/')
        : new providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');

export default provider;
