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
exports.getDays = void 0;
const query_js_1 = __importDefault(require("./query.js"));
const parts_js_1 = require("./parts.js");
const ethers_1 = require("ethers");
function createWeaponTable(graphClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const weapons = Object.values(parts_js_1.parts).filter((part) => part.part === parts_js_1.partTypes['weapon']);
        const records = [
            ['Name', 'New Born', 'New Born 4d', 'New Born 5d', 'Adult'],
        ];
        for (const weapon of weapons) {
            const variables = {
                page: 0,
                forSale: 1,
                breedCount: [0],
                handD: [weapon.id],
                sortPrice: false,
            };
            let newBorns = yield graphClient.request(query_js_1.default, Object.assign(Object.assign({}, variables), { lifeStage: 1, limit: 100 }));
            let adults = yield graphClient.request(query_js_1.default, Object.assign(Object.assign({}, variables), { lifeStage: 2, limit: 1 }));
            newBorns = newBorns.pets;
            adults = adults.pets;
            const nb4d = newBorns.find((nb) => getDays(nb.createdAt) >= 4 && getDays(nb.createdAt) < 5);
            const nb5d = newBorns.find((nb) => getDays(nb.createdAt) >= 5);
            records.push([
                weapon.name,
                newBorns[0] && ethers_1.utils.formatEther(newBorns[0].price),
                nb4d && ethers_1.utils.formatEther(nb4d.price),
                nb5d && ethers_1.utils.formatEther(nb5d.price),
                adults[0] && ethers_1.utils.formatEther(adults[0].price),
            ]);
        }
        console.log(records.map((e) => e.join(',')).join('\n'));
    });
}
exports.default = createWeaponTable;
function getDays(createdAt) {
    const createdDate = new Date(createdAt);
    let delta = Math.abs(Date.now() - createdDate) / 1000;
    const days = Math.floor(delta / 86400);
    return days;
}
exports.getDays = getDays;
