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
const ethers_1 = require("ethers");
const user_model_1 = __importDefault(require("../models/user.model"));
function changeWallet(user, interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const publicAddress = interaction.options.getString('bep20_address');
            if (publicAddress && !ethers_1.utils.isAddress(publicAddress)) {
                yield interaction.reply({ content: 'Please, send a valid BEP-20 Address', ephemeral: true });
            }
            if (user === null || user === void 0 ? void 0 : user.publicAddress) {
                yield interaction.reply({ content: 'Wallet already linked', ephemeral: true });
            }
            else {
                if (!user && publicAddress) {
                    if (interaction.user) {
                        user = yield user_model_1.default.create({ publicAddress, discordID: interaction.user.id });
                    }
                }
                else if (user && publicAddress && !user.publicAddress) {
                    user.publicAddress = publicAddress.toLowerCase();
                    user.save();
                    yield interaction.reply({ content: `${publicAddress} linked to your user`, ephemeral: true });
                }
                else {
                    yield interaction.reply({ content: 'Something went wrong, try again or send a ticket', ephemeral: true });
                }
            }
        }
        catch (e) {
            if (e.message) {
                yield interaction.reply({ content: e.message, ephemeral: true });
            }
            else {
                console.log(e);
            }
        }
    });
}
exports.default = changeWallet;
