"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ERC20_1 = __importDefault(require("../utils/ERC20"));
const provider_1 = __importDefault(require("../utils/provider"));
const lodash_1 = __importDefault(require("lodash"));
const ethers_1 = require("ethers");
function add(user, txID) {
    return __awaiter(this, void 0, void 0, function* () {
        const tx = yield provider_1.default.getTransaction(txID);
        const receipt = yield tx.wait(2);
        const busd = (0, ERC20_1.default)('0xe9e7cea3dedca5984780bafc599bd69add087d56');
        const { address: busdAddress, topics } = busd.filters.Transfer(user.publicAddress, process.env.SUBSCRIPTION_ADDRESS);
        if (txID === user.txID || receipt.confirmations > 201600) {
            throw Error('This transaction was already used, try another');
        }
        for (const log of receipt.logs) {
            if (lodash_1.default.isEqual(log.topics, topics)) {
                const value = ethers_1.utils.formatEther(parseInt(log.data, 16).toString());
                console.log(value);
                if (value === '20.0') {
                    user.subscriptionDue || (user.subscriptionDue = new Date());
                    user.subscriptionDue.setDate(user.subscriptionDue.getDate() + 7);
                    user.txID = txID;
                    user.save();
                    return true;
                }
                else {
                    throw new Error('The value of BUSD is not right, please send the right amount and token (20 BUSD) or open a ticket');
                }
            }
        }
        return false;
    });
}
exports.default = add;
