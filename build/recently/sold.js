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
const index_1 = __importDefault(require("../query/index"));
const printNinneko_1 = __importDefault(require("../utils/printNinneko"));
const ethers_1 = require("ethers");
function sold(graphClient, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterSold = {
            address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
            topics: [
                '0x7bd0b0502f39fae4cc20b3da611aa9e529ffa26435779fe6f2068f197151d9d0',
            ],
        };
        provider_1.default.on(filterSold, (log, event) => __awaiter(this, void 0, void 0, function* () {
            if (log) {
                const tokenId = log === null || log === void 0 ? void 0 : log.topics[1];
                const variables = {
                    id: parseInt(tokenId, 16),
                };
                const data = yield graphClient.request(index_1.default.pet, variables);
                const pet = data.pet;
                client.channels.cache.get('953447957896761384').send({
                    embeds: [
                        yield (0, printNinneko_1.default)(pet, ethers_1.utils.formatEther(parseInt(log.data, 16).toString())),
                    ],
                });
            }
        }));
    });
}
exports.default = sold;
