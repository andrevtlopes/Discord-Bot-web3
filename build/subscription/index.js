"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_1 = __importDefault(require("./add"));
const buySubscription_1 = __importDefault(require("./buySubscription"));
const changeWallet_1 = __importDefault(require("./changeWallet"));
exports.default = { add: add_1.default, changeWallet: changeWallet_1.default, buySubscription: buySubscription_1.default };
