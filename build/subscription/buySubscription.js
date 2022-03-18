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
const add_1 = __importDefault(require("./add"));
function buySubscription(user, interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const txID = (_a = interaction.options.getString('transaction_id')) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            yield interaction.reply({ content: 'Working on it!', ephemeral: true });
            if (!(user === null || user === void 0 ? void 0 : user.publicAddress)) {
                yield interaction.editReply({ content: 'Please, link a Wallet Address' });
            }
            else if (txID && (yield (0, add_1.default)(user, txID))) {
                const guild = interaction.client.guilds.cache.get('951929724442132520');
                const role = guild === null || guild === void 0 ? void 0 : guild.roles.cache.find(role => role.name === 'Subscribed');
                const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.find(member => member.id === user.discordID);
                if (role && member) {
                    yield (member === null || member === void 0 ? void 0 : member.roles).add(role);
                }
                const now = new Date();
                yield interaction.editReply({ content: 'Subscribed until next week' });
                setTimeout(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        console.log('Role ended');
                        yield (member === null || member === void 0 ? void 0 : member.roles).remove(role);
                    });
                }, user.subscriptionDue.getTime() - now.getTime());
            }
            else {
                yield interaction.editReply({ content: 'Something went wrong, try again or send a ticket' });
            }
        }
        catch (e) {
            if (e.message) {
                yield interaction.editReply({ content: e.message });
            }
            else {
                console.log(e);
            }
        }
    });
}
exports.default = buySubscription;
