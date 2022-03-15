"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const discord_js_1 = __importStar(require("discord.js"));
const graphql_request_1 = require("graphql-request");
const search_1 = __importDefault(require("./search"));
const breed_1 = __importDefault(require("./breed"));
const simpleSearch_1 = __importDefault(require("./simpleSearch"));
const networks_1 = require("@ethersproject/networks");
const ethers_1 = require("ethers");
const index_1 = __importDefault(require("./query/index"));
const searchHelper_1 = require("./searchHelper");
const parts_1 = require("./parts");
// @ts-ignore
const ascii_table3_1 = require("ascii-table3");
const types_1 = require("./utils/types");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new discord_js_1.default.Client({
            intents: ['GUILDS', 'GUILD_MESSAGES'],
        });
        client.login(process.env.BOT_TOKEN);
        const prefix = '!';
        const endpoint = 'https://api.ninneko.com/graphql';
        const graphClient = new graphql_request_1.GraphQLClient(endpoint, { headers: {} });
        const network = (0, networks_1.getNetwork)(56);
        const provider = network.name === 'unknown'
            ? new ethers_1.ethers.providers.JsonRpcProvider('http://localhost:8545/')
            : new ethers_1.ethers.providers.JsonRpcProvider('https://bsc-dataseed1.ninicoin.io/');
        client.on('ready', () => __awaiter(this, void 0, void 0, function* () {
            console.log('Connected to discord bot');
            // client.channels.cache.get('952338766511628378').send('Bot Started!');
        }));
        const filterSold = {
            address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
            topics: [
                '0x7bd0b0502f39fae4cc20b3da611aa9e529ffa26435779fe6f2068f197151d9d0',
            ],
        };
        provider.on(filterSold, (log, event) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (log) {
                const tokenId = log === null || log === void 0 ? void 0 : log.topics[1];
                const variables = {
                    id: parseInt(tokenId, 16),
                };
                let pet = { forSale: 0 };
                while ((pet === null || pet === void 0 ? void 0 : pet.forSale) !== 1) {
                    const data = yield graphClient.request(index_1.default.pet, variables);
                    console.log(JSON.stringify(data, undefined, 2));
                    pet = data.pet;
                }
                let petArray = [];
                let idx = 1;
                for (const part of parts_1.partArray) {
                    if (idx % 2 && part !== 'ear' && part !== 'mouth') {
                        petArray.push([
                            '',
                            (_a = (0, searchHelper_1.byId)(parts_1.partTypes, idx)) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                            (_b = (0, searchHelper_1.byId)(parts_1.partTypes, idx + 1)) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                        ]);
                        petArray.push([
                            'D',
                            (0, searchHelper_1.getPartName)(pet[part + 'D']),
                            (0, searchHelper_1.getPartName)(pet[parts_1.partArray[idx - 1] + 'D']),
                        ]);
                        petArray.push([
                            'H1',
                            (0, searchHelper_1.getPartName)(pet[part + 'R']),
                            (0, searchHelper_1.getPartName)(pet[parts_1.partArray[idx - 1] + 'R']),
                        ]);
                        petArray.push([
                            'H2',
                            (0, searchHelper_1.getPartName)(pet[part + 'R1']),
                            (0, searchHelper_1.getPartName)(pet[parts_1.partArray[idx - 1] + 'R1']),
                        ]);
                        petArray.push(['', '', '']);
                    }
                    idx = idx + 1;
                }
                const table = new ascii_table3_1.AsciiTable3()
                    .setHeading(pet.id, pet.name, ethers_1.utils.formatEther(pet.price.toString()) + ' BNB')
                    .setAlign(3, ascii_table3_1.AlignmentEnum.RIGHT)
                    .addRowMatrix(petArray);
                table.setStyle('compact');
                client.channels.cache
                    .get('952338766511628378')
                    .send('```' + table.toString() + '```');
            }
        }));
        const filterListed = {
            address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
            topics: [
                '0x187f616f90eaf716f9196a8f2eaead21fec5a107062159e6cc7e92b70ba9bca9',
            ],
        };
        provider.on(filterListed, (log, event) => __awaiter(this, void 0, void 0, function* () {
            if (log) {
                const tokenId = log === null || log === void 0 ? void 0 : log.topics[1];
                const variables = {
                    id: parseInt(tokenId, 16),
                };
                let pet = { forSale: 0 };
                while ((pet === null || pet === void 0 ? void 0 : pet.forSale) !== 1) {
                    const data = yield graphClient.request(index_1.default.pet, variables);
                    pet = data.pet;
                }
                const fields = parts_1.partArray.map((part, idx) => {
                    var _a;
                    return ({
                        name: (_a = (0, searchHelper_1.byId)(parts_1.partTypes, idx + 1)) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                        value: `${(0, searchHelper_1.getPartName)(pet[part + 'D'])}\n${(0, searchHelper_1.getPartName)(pet[part + 'R'])}\n${(0, searchHelper_1.getPartName)(pet[part + 'R1'])}`,
                        inline: true,
                    });
                });
                const lifeStage = (0, searchHelper_1.getLifeStage)(pet.createdAt);
                const exampleEmbed = new discord_js_1.MessageEmbed()
                    .setColor(types_1.factions[pet.faction].color || '#0099ff') // 00ab55
                    .setTitle(`${pet.id} - ${pet.name}`)
                    .setURL(`https://market.ninneko.com/pet/${pet.id}`)
                    // .setDescription('Some description here')
                    .setThumbnail(pet.avatarURL)
                    .addFields({
                    name: 'Faction',
                    value: types_1.factions[pet.faction].name,
                    inline: true,
                }, {
                    name: 'Price',
                    value: ethers_1.utils.formatEther(pet.price.toString()) + ' BNB',
                    inline: true,
                }, {
                    name: lifeStage === 'Adult' ? 'Breeds' : 'New Born',
                    value: lifeStage === 'Adult'
                        ? `${pet.breedCount}/6\n`
                        : lifeStage,
                    inline: true,
                })
                    .addFields(fields);
                // .setImage('https://i.imgur.com/AfFp7pu.png')
                // .setTimestamp()
                // .setFooter({ text: factions[pet.faction].name, iconURL: factions[pet.faction].imageURL });
                client.channels.cache
                    .get('952338766511628378').send({ embeds: [exampleEmbed] });
                // client.channels.cache.get('952338766511628378').send('```' + table.toString() + '```');
            }
        }));
        client.on('messageCreate', function (message) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (message.author.bot)
                    return;
                if (!message.content.startsWith(prefix))
                    return;
                const commandBody = message.content.slice(prefix.length);
                const args = commandBody.split('@');
                const command = (_a = args === null || args === void 0 ? void 0 : args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                if (command === 'ping') {
                    const timeTaken = Date.now() - message.createdTimestamp;
                    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
                }
                // search@Faction:Class:Breed:LifeStage:Parts:Sort,
                // Parts: weapon, tail, eye, hat, ear, mouth
                else if (command === 'search') {
                    message.reply(yield (0, search_1.default)(args, graphClient));
                }
                else if (command === 'breed') {
                    (0, breed_1.default)(args);
                }
                else if (command === 'simple') {
                    message.reply(yield (0, simpleSearch_1.default)(args, graphClient));
                }
                else if (command === 'snipe') {
                }
            });
        });
        // const data = await graphClient.request(query, variables);
        // console.log(JSON.stringify(data, undefined, 2));
    });
}
main().catch((error) => console.error(error));
