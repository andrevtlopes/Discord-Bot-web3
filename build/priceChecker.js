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
const searchHelper_js_1 = require("./searchHelper.js");
function priceChecker(args, graphClient) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchArgs = args
                .shift()
                .toLowerCase()
                .split(':')
                .map((args) => (args === '' ? null : args));
            const breed = searchArgs.shift();
            const partArgs = searchArgs
                .shift()
                .split(',')
                .map((args) => (args === '' ? null : args));
            const variables = {
                page: 0,
                lifeStage,
                limit: 9,
                forSale: 1,
                breedCount: breed,
                faction,
                class: clazz,
                handD: weapon[0],
                tailD: tail[0],
                eyesD: eye[0],
                hairD: hat[0],
                earsD: ear[0],
                mouthD: mouth[0],
                mouthR: mouth[1],
                mouthR1: mouth[2],
                sortID,
                sortPrice,
                priceSetAt,
            };
            return yield (0, searchHelper_js_1.queryNinnekos)({
                breed,
                parts: partArgs,
                sort: 'price',
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
exports.default = priceChecker;
