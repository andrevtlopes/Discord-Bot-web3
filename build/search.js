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
const parts_js_1 = require("./parts.js");
const searchHelper_js_1 = require("./searchHelper.js");
function search(args, graphClient) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchArgs = args
                .shift()
                .toLowerCase()
                .split(':')
                .map((args) => (args === '' ? null : args));
            const faction = getItemsNumber(searchArgs.shift(), parts_js_1.factions);
            const clazz = getItemsNumber(searchArgs.shift(), parts_js_1.classes);
            let breed = searchArgs.shift();
            const lifeStage = getItemsNumber(searchArgs.shift(), parts_js_1.lifeStages, false);
            const partArgs = searchArgs
                .shift()
                .split(',')
                .map((args) => (args === '' ? null : args));
            const sort = searchArgs.shift();
            return yield (0, searchHelper_js_1.queryNinnekos)({
                faction,
                clazz,
                breed,
                lifeStage,
                parts: partArgs,
                sort,
            }, graphClient);
        }
        catch (e) {
            if (e.message)
                return e.message;
            // message.reply(`${e.message}`);
            console.log(e);
        }
    });
}
exports.default = search;
