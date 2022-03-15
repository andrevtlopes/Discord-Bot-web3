import { getNetwork } from '@ethersproject/networks';
import { providers } from 'ethers';

const network = getNetwork(56);
const provider =
    network.name === 'unknown'
        ? new providers.JsonRpcProvider('http://localhost:8545/')
        : new providers.JsonRpcProvider('https://bsc-dataseed1.ninicoin.io/');

export default provider;
