"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const networks_1 = require("@ethersproject/networks");
const ethers_1 = require("ethers");
const network = (0, networks_1.getNetwork)(56);
const provider = network.name === 'unknown'
    ? new ethers_1.providers.JsonRpcProvider('http://localhost:8545/')
    : new ethers_1.providers.JsonRpcProvider('https://bsc-dataseed1.ninicoin.io/');
exports.default = provider;
