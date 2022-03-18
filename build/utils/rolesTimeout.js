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
const user_model_1 = __importDefault(require("../models/user.model"));
function rolesTimeout(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const guild = client.guilds.cache.get('951929724442132520');
        const role = guild === null || guild === void 0 ? void 0 : guild.roles.cache.find((r) => r.name === 'Subscribed');
        const users = yield user_model_1.default.findAll();
        const now = new Date();
        for (const user of users) {
            if (user.isSubscribed()) {
                setTimeout(function () {
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        console.log('Role ended');
                        const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.find(member => member.id === user.discordID);
                        yield ((_a = member === null || member === void 0 ? void 0 : member.roles) === null || _a === void 0 ? void 0 : _a.remove(role));
                    });
                }, user.subscriptionDue.getTime() - now.getTime());
            }
        }
    });
}
exports.default = rolesTimeout;
