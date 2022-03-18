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
require("./db");
require("dotenv/config");
const discord_js_1 = __importDefault(require("discord.js"));
const graphql_request_1 = require("graphql-request");
const search_1 = __importDefault(require("./search"));
const subscription_1 = __importDefault(require("./subscription"));
const user_model_1 = __importDefault(require("./models/user.model"));
const sniper_1 = __importDefault(require("./sniper"));
const db_1 = require("./db");
const recently_1 = __importDefault(require("./recently"));
const messages_1 = __importDefault(require("./utils/messages"));
const rolesTimeout_1 = __importDefault(require("./utils/rolesTimeout"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let disableRecently = false;
        if (process.env.NODE_ENV !== 'production') {
            disableRecently = true;
            console.log('Recently disabled!');
        }
        const client = new discord_js_1.default.Client({
            intents: [
                'GUILDS',
                'GUILD_MESSAGES',
                'DIRECT_MESSAGES',
                'GUILD_PRESENCES',
            ],
            partials: ['CHANNEL'],
        });
        client.login(process.env.BOT_TOKEN);
        yield (0, rolesTimeout_1.default)(client);
        console.log(new Date().getTime());
        const endpoint = 'https://api.ninneko.com/graphql';
        const graphClient = new graphql_request_1.GraphQLClient(endpoint, { headers: {} });
        client.on('ready', () => __awaiter(this, void 0, void 0, function* () {
            console.log('Connected to discord bot');
        }));
        if (!disableRecently) {
            recently_1.default.listed(graphClient, client);
            recently_1.default.sold(graphClient, client);
        }
        client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isCommand())
                return;
            const user = yield user_model_1.default.findOne({
                where: { discordID: interaction.user.id || '' },
            });
            const { commandName } = interaction;
            if (user === null || user === void 0 ? void 0 : user.isSubscribed()) {
                if (commandName === 'ping') {
                    yield interaction.reply('Pong!');
                }
                else if (commandName === 'search') {
                    yield search_1.default.simple(graphClient, interaction);
                }
                else if (commandName === 'subscribe') {
                    const subCommand = interaction.options.getSubcommand();
                    if (subCommand === 'info') {
                        yield interaction.reply({
                            content: `\`\`\`Not Implemented\`\`\``,
                            ephemeral: true,
                        });
                    }
                    else {
                        yield interaction.reply({
                            content: 'Already Subscribed',
                            ephemeral: true,
                        });
                    }
                }
                else if (commandName === 'snipe') {
                    const subCommand = interaction.options.getSubcommand();
                    if (subCommand === 'add') {
                        yield sniper_1.default.add(user, interaction);
                    }
                    else if (subCommand === 'remove') {
                        yield sniper_1.default.remove(user, interaction);
                    }
                    else if (subCommand === 'info') {
                        yield sniper_1.default.check(user, interaction);
                    }
                }
                else if (commandName === 'help') {
                    yield interaction.reply({
                        content: `\`\`\`${messages_1.default.helpSubscribed}\`\`\``,
                        ephemeral: true,
                    });
                }
                else if (commandName === 'show') {
                    yield interaction.reply({
                        content: `\`\`\`Not Implemented\`\`\``,
                        ephemeral: true,
                    });
                }
            }
            else {
                if (commandName === 'subscribe') {
                    const subCommand = interaction.options.getSubcommand();
                    if (subCommand === 'buy') {
                        yield subscription_1.default.buySubscription(user, interaction);
                    }
                    else if (subCommand === 'wallet') {
                        yield subscription_1.default.changeWallet(user, interaction);
                    }
                    else if (subCommand === 'info') {
                        yield interaction.reply({
                            content: `\`\`\`Not Implemented\`\`\``,
                            ephemeral: true,
                        });
                    }
                }
                else if (commandName === 'help') {
                    yield interaction.reply({
                        content: `\`\`\`${messages_1.default.helpUnsubscribe}\`\`\``,
                        ephemeral: true,
                    });
                }
                else {
                    yield interaction.reply({
                        content: 'Please, subscribe to use this command',
                        ephemeral: true,
                    });
                }
            }
        }));
        client.on('messageCreate', (msg) => __awaiter(this, void 0, void 0, function* () {
            if (msg.author.bot)
                return;
            if (msg.channel.type === 'DM') {
                const user = yield user_model_1.default.findOne({
                    where: { discordID: msg.author.id || '' },
                });
                let availableCommands = {
                    '/subscribe': ['wallet', 'buy'],
                    '\nIf you need help:': '',
                    '/help': ''
                };
                if (user === null || user === void 0 ? void 0 : user.isSubscribed()) {
                    const newCommands = {
                        '/subscribe': ['info'],
                        '/search': '',
                        '/snipe': ['add', 'remove', 'info'],
                        '\nIf you want a list of parts to use with search you can try:': '',
                        '/show': ['weapons', 'eyes', 'hats', 'tails'],
                        '\nIf you need help:': '',
                        '/help': ''
                    };
                    availableCommands = newCommands;
                }
                const commands = [];
                for (const command of Object.keys(availableCommands)) {
                    if (typeof availableCommands[command] !== 'string') {
                        for (const subCommand of availableCommands[command]) {
                            commands.push(`${command} ${subCommand}`);
                        }
                    }
                    else {
                        commands.push(`${command}`);
                    }
                }
                msg.channel.send('Available commands:\n```' + commands.join('\n') + '```');
            }
        }));
        client.on('guildMemberAdd', (member) => __awaiter(this, void 0, void 0, function* () {
            member.send(`\`\`\`${messages_1.default.welcome}\`\`\``);
        }));
        yield db_1.sequelize.sync();
    });
}
main().catch((error) => console.error(error));
