"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const provider_1 = __importDefault(require("./provider"));
const abi = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function transfer(address to, uint amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint amount)'
];
const ERC20 = (address) => new ethers_1.ethers.Contract(address, abi, provider_1.default);
exports.default = ERC20;
