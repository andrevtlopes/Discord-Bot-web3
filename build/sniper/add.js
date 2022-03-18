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
const parts_1 = require("../parts");
const searchHelper_1 = require("../searchHelper");
function add(user, interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let parts = {};
            for (const part of parts_1.importantPartArray) {
                parts = Object.assign(Object.assign({}, parts), { [part.name + 'D']: (0, searchHelper_1.getPartNumber)(interaction.options.getString((0, searchHelper_1.byId)(parts_1.partTypes, part.id))), [part.name + 'R']: (0, searchHelper_1.getPartNumber)(interaction.options.getString((0, searchHelper_1.byId)(parts_1.partTypes, part.id) + 'h1')), [part.name + 'R1']: (0, searchHelper_1.getPartNumber)(interaction.options.getString((0, searchHelper_1.byId)(parts_1.partTypes, part.id) + 'h2')) });
            }
            const snipeName = interaction.options.getString('name');
            if (snipeName) {
                yield interaction.reply({ content: yield addSnipe(user, snipeName, parts), ephemeral: true });
            }
            else {
                yield interaction.reply({ content: 'Snipe name is not set', ephemeral: true });
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
exports.default = add;
const addSnipe = (user, name, parts) => __awaiter(void 0, void 0, void 0, function* () {
    const countSnipes = yield user.countSnipes();
    if (countSnipes < 3) {
        yield user.createSnipe(Object.assign({ name: name }, parts));
        return `Snipe created: ${name}`;
    }
    else {
        return 'You can only add up to 3 Snipes, remove one to add a new one';
    }
});
