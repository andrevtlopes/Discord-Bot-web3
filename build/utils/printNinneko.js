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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const parts_1 = require("../parts");
const searchHelper_1 = require("../searchHelper");
const types_1 = require("./types");
function printNinneko(pet, price) {
    return __awaiter(this, void 0, void 0, function* () {
        const fields = parts_1.partArray.map((part, idx) => {
            var _a;
            return ({
                name: (_a = (0, searchHelper_1.byId)(parts_1.partTypes, idx + 1)) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                value: `${(0, searchHelper_1.getPartName)(pet[part + 'D'])}\n${(0, searchHelper_1.getPartName)(pet[part + 'R'])}\n${(0, searchHelper_1.getPartName)(pet[part + 'R1'])}`,
                inline: true,
            });
        });
        const lifeStage = (0, searchHelper_1.getLifeStage)(pet.createdAt);
        const color = types_1.factions[pet.faction].color;
        return new discord_js_1.MessageEmbed()
            .setColor(color)
            .setTitle(`${pet.id} - ${pet.name}`)
            .setURL(`https://market.ninneko.com/pet/${pet.id}`)
            .setThumbnail(pet.avatarURL)
            .addFields({
            name: 'Faction',
            value: types_1.factions[pet.faction].name,
            inline: true,
        }, {
            name: 'Price',
            value: price + ' BNB',
            inline: true,
        }, {
            name: lifeStage === 'Adult' ? 'Breeds' : 'New Born',
            value: lifeStage === 'Adult'
                ? `${pet.breedCount}/6\n`
                : lifeStage,
            inline: true,
        })
            .addFields(fields);
    });
}
exports.default = printNinneko;
