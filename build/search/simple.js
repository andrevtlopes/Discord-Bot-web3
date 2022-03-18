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
const searchHelper_1 = require("../searchHelper");
const types_1 = require("../utils/types");
function simple(graphClient, interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let parts = {};
            for (const part of types_1.partialParts) {
                const id = (0, searchHelper_1.getPartNumber)(interaction.options.getString(part.discordName), part.partId);
                parts = Object.assign(Object.assign({}, parts), { [part.name]: id === null ? null : [id] });
            }
            const breed = interaction.options.getInteger('breed');
            const lifeStage = interaction.options.getString('lifestage');
            yield interaction.reply({
                content: yield simpleSearch(graphClient, parts, breed, lifeStage),
                ephemeral: true,
            });
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
exports.default = simple;
const simpleSearch = (graphClient, parts, breed, lifeStage) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, searchHelper_1.queryNinnekos)({
        breed,
        parts,
        lifeStage,
        sort: 'price',
    }, graphClient);
});
