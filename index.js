import { createRequire } from 'module'; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
import Discord from 'discord.js';
import { GraphQLClient, gql } from 'graphql-request';
const config = require('./config.json'); // use the require method
import search from './search.js';
import breed from './breed.js';
import simpleSearch from './simpleSearch.js';
import { getNetwork } from '@ethersproject/networks';
import { ethers, getDefaultProvider } from 'ethers';
import query from './query/index.js';
import { byId, getPartName } from './searchHelper.js';
import { partArray, partTypes } from './parts.js';
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';

async function main() {
    const client = new Discord.Client({
        intents: ['GUILDS', 'GUILD_MESSAGES'],
    });
    client.login(config.BOT_TOKEN);
    const prefix = '!';

    const endpoint = 'https://api.ninneko.com/graphql';

    const graphClient = new GraphQLClient(endpoint, { headers: {} });

    const network = getNetwork(config.CHAIN_ID);
    const provider =
        network.name === 'unknown'
            ? new ethers.providers.JsonRpcProvider('http://localhost:8545/')
            : new ethers.providers.JsonRpcProvider(
                  'https://bsc-dataseed1.ninicoin.io/'
              );

    const filter = {
        address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
        topics: [
            '0x7bd0b0502f39fae4cc20b3da611aa9e529ffa26435779fe6f2068f197151d9d0',
        ],
    };

    provider.on(filter, async (log, event) => {
        if (log) {
            const tokenId = log?.topics[1];
            const variables = {
                id: parseInt(tokenId, 16),
            };
            const data = await graphClient.request(query.pet, variables);
            console.log(JSON.stringify(data, undefined, 2));
            const pet = data.pet;

            let petArray = [];
            let idx = 1;
        
            for (const part of partArray) {
                if (idx % 2) {
                    petArray.push(['', byId(partTypes, idx)?.toUpperCase(), byId(partTypes, idx + 1)?.toUpperCase() ]);
                    petArray.push(['D', getPartName(pet[part + 'D']), getPartName(pet[partArray[idx - 1] + 'D'])]);
                    petArray.push(['H1', getPartName(pet[part + 'R']), getPartName(pet[partArray[idx - 1] + 'R'])]);
                    petArray.push(['H2', getPartName(pet[part + 'R1']), getPartName(pet[partArray[idx - 1] + 'R1'])]);
                    petArray.push(['', '', '']);
                }
                idx = idx + 1;
            }
        
            const table = new AsciiTable3()
            .setHeading(pet.id, pet.name, utils.formatEther(pet.price.toString()) + ' BNB')
            .setAlign(3, AlignmentEnum.RIGHT)
            .addRowMatrix(petArray);

            table.setStyle('compact');

            client.channels.cache.get(952338766511628378).send(table.toString());
        }
    });

    client.on('ready', async () => {
        console.log('algo');
        // topics: 0x7bd0b0502f39fae4cc20b3da611aa9e529ffa26435779fe6f2068f197151d9d0
        // 0x187f616f90eaf716f9196a8f2eaead21fec5a107062159e6cc7e92b70ba9bca9

        // const ethers = require("ethers");
        // (async () => {
        // const provider = new ethers.providers.JsonRpcProvider("http://sample-endpoint-name.network.quiknode.pro/token-goes-here/");
        // const filterId = await provider.getLogs(
        //     "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        // );
        // console.log(filterId);
        // })();
    });

    client.on('messageCreate', async function (message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split('@');
        const command = args.shift().toLowerCase();

        if (command === 'ping') {
            const timeTaken = Date.now() - message.createdTimestamp;
            message.reply(
                `Pong! This message had a latency of ${timeTaken}ms.`
            );
        }
        // search@Faction:Class:Breed:LifeStage:Parts:Sort,
        // Parts: weapon, tail, eye, hat, ear, mouth
        else if (command === 'search') {
            message.reply(await search(args, graphClient));
        } else if (command === 'breed') {
            breed(args);
        } else if (command === 'simple') {
            message.reply(await simpleSearch(args, graphClient));
        } else if (command === 'snipe') {
        }
    });

    // const data = await graphClient.request(query, variables);
    // console.log(JSON.stringify(data, undefined, 2));
}

main().catch((error) => console.error(error));
