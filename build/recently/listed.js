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
const provider_1 = __importDefault(require("../utils/provider"));
const snipe_model_1 = __importDefault(require("../models/snipe.model"));
const index_1 = __importDefault(require("../query/index"));
const printNinneko_1 = __importDefault(require("../utils/printNinneko"));
const ethers_1 = require("ethers");
function listed(graphClient, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterListed = {
            address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
            topics: [
                '0x187f616f90eaf716f9196a8f2eaead21fec5a107062159e6cc7e92b70ba9bca9',
            ],
        };
        provider_1.default.on(filterListed, (log, event) => __awaiter(this, void 0, void 0, function* () {
            if (log) {
                const tokenId = log === null || log === void 0 ? void 0 : log.topics[1];
                const variables = {
                    id: parseInt(tokenId, 16),
                };
                const data = yield graphClient.request(index_1.default.pet, variables);
                const pet = data.pet;
                const ninneko = yield (0, printNinneko_1.default)(pet, ethers_1.utils.formatEther(parseInt(log.data, 16).toString()));
                client.channels.cache.get('952338766511628378').send({
                    embeds: [
                        ninneko
                    ]
                });
                const snipes = yield snipe_model_1.default.findAll();
                for (const snipe of snipes) {
                    const user = yield snipe.getUser();
                    if (user && user.isSubscribed()) {
                        const member = yield client.users.fetch(user.discordID);
                        if (snipe.compareSnipeWithNinneko(pet)) {
                            member === null || member === void 0 ? void 0 : member.send({
                                embeds: [
                                    ninneko
                                ]
                            });
                        }
                    }
                }
            }
        }));
    });
}
exports.default = listed;
