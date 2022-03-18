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
function remove(user, interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snipeName = interaction.options.getString('name');
            if (snipeName) {
                yield interaction.reply({ content: yield removeSnipe(user, snipeName), ephemeral: true });
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
exports.default = remove;
const removeSnipe = (user, name) => __awaiter(void 0, void 0, void 0, function* () {
    const snipes = yield user.getSnipes();
    const snipe = snipes.filter(s => s.name === name);
    if (snipe.length > 0) {
        yield user.removeSnipe(snipe[0]);
        return `Snipe removed: ${name}`;
    }
    return 'Failed to remove Snipe, try a valid name';
});
