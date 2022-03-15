import './db';
import 'dotenv/config';

import Discord, { MessageEmbed, TextChannel } from 'discord.js';
import { GraphQLClient, gql } from 'graphql-request';
import search from './search';
import breed from './breed';
import simpleSearch from './simpleSearch';
import { getNetwork } from '@ethersproject/networks';
import { providers, utils } from 'ethers';
import query from './query/index';
import { byId, getLifeStage, getPartName } from './searchHelper';
import { importantPartArray, partArray, partTypes } from './parts';
// @ts-ignore
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';

import { factions } from './utils/types';
import provider from './utils/provider';
import subscription from './subscription';
import User from './models/user.model';

async function main() {
    const client = new Discord.Client({
        intents: ['GUILDS', 'GUILD_MESSAGES'],
    });
    client.login(process.env.BOT_TOKEN);
    const prefix = '!';

    const endpoint = 'https://api.ninneko.com/graphql';

    const graphClient = new GraphQLClient(endpoint, { headers: {} });

    client.on('ready', async () => {
        console.log('Connected to discord bot');
        // client.channels.cache.get('952338766511628378').send('Bot Started!');
    });

    const filterSold = {
        address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
        topics: [
            '0x7bd0b0502f39fae4cc20b3da611aa9e529ffa26435779fe6f2068f197151d9d0',
        ],
    };

    provider.on(filterSold, async (log, event) => {
        if (log) {
            const tokenId = log?.topics[1];
            const variables = {
                id: parseInt(tokenId, 16),
            };

            let pet: any = { forSale: 0 };
            // while (pet?.forSale !== 1) {
                const data = await graphClient.request(query.pet, variables);
                console.log(JSON.stringify(data, undefined, 2));
                pet = data.pet;
            // }

            let petArray = [];
            let idx = 1;

            for (const part of partArray) {
                if (idx % 2 && part !== 'ear' && part !== 'mouth') {
                    petArray.push([
                        '',
                        byId(partTypes, idx)?.toUpperCase(),
                        byId(partTypes, idx + 1)?.toUpperCase(),
                    ]);
                    petArray.push([
                        'D',
                        getPartName(pet[part + 'D']),
                        getPartName(pet[partArray[idx - 1] + 'D']),
                    ]);
                    petArray.push([
                        'H1',
                        getPartName(pet[part + 'R']),
                        getPartName(pet[partArray[idx - 1] + 'R']),
                    ]);
                    petArray.push([
                        'H2',
                        getPartName(pet[part + 'R1']),
                        getPartName(pet[partArray[idx - 1] + 'R1']),
                    ]);
                    petArray.push(['', '', '']);
                }
                idx = idx + 1;
            }

            const table = new AsciiTable3()
                .setHeading(
                    pet.id,
                    pet.name,
                    utils.formatEther(parseInt(log?.data, 16).toString()) + ' BNB'
                )
                .setAlign(3, AlignmentEnum.RIGHT)
                .addRowMatrix(petArray);

            table.setStyle('compact');

            (
                client.channels.cache.get('952338766511628378') as TextChannel
            ).send('```' + table.toString() + '```');
        }
    });

    const filterListed = {
        address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
        topics: [
            '0x187f616f90eaf716f9196a8f2eaead21fec5a107062159e6cc7e92b70ba9bca9',
        ],
    };

    provider.on(filterListed, async (log, event) => {
        if (log) {
            const tokenId = log?.topics[1];
            const variables = {
                id: parseInt(tokenId, 16),
            };

            const data = await graphClient.request(query.pet, variables);
            const pet = data.pet;

            const fields = partArray.map((part, idx) => ({
                name: byId(partTypes, idx + 1)?.toUpperCase(),
                value: `${getPartName(pet[part + 'D'])}\n${getPartName(
                    pet[part + 'R']
                )}\n${getPartName(pet[part + 'R1'])}`,
                inline: true,
            }));

            const lifeStage = getLifeStage(pet.createdAt);
             // @ts-ignore
            const color = factions[pet.faction].color;
           
            const exampleEmbed = new MessageEmbed()
                .setColor(color) // 00ab55
                .setTitle(`${pet.id} - ${pet.name}`)
                .setURL(`https://market.ninneko.com/pet/${pet.id}`)
                // .setDescription('Some description here')
                .setThumbnail(pet.avatarURL)
                .addFields(
                    {
                        name: 'Faction',
                        // @ts-ignore
                        value: factions[pet.faction].name,
                        inline: true,
                    },
                    {
                        name: 'Price',
                        value: utils.formatEther(parseInt(log?.data, 16).toString()) + ' BNB',
                        inline: true,
                    },
                    {
                        name: lifeStage === 'Adult' ? 'Breeds' : 'New Born',
                        value:
                            lifeStage === 'Adult'
                                ? `${pet.breedCount}/6\n`
                                : lifeStage,
                        inline: true,
                    }
                )
                .addFields(fields);
            // .setImage('https://i.imgur.com/AfFp7pu.png')
            // .setTimestamp()
            // .setFooter({ text: factions[pet.faction].name, iconURL: factions[pet.faction].imageURL });

            (
                client.channels.cache.get('952338766511628378') as TextChannel
            ).send({ embeds: [exampleEmbed] });

            // client.channels.cache.get('952338766511628378').send('```' + table.toString() + '```');
        }
    });

    client.on('messageCreate', async function (message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split('@');
        const command = args?.shift()?.toLowerCase();

        let user = await User.findOne({ where: { discordID: message.author.id } });
        if (user?.isSubscribed()) {
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
        }
        else {
            if (command === 'subscribe') {
                try {
                    const subArgs = args
                        ?.shift()
                        ?.toLowerCase()
                        .split(':')
                        .map((args) => (args === '' ? null : args));
                    
                    const publicAddress = subArgs?.shift();
                    const txID = subArgs?.shift();
    
                    if (!user && txID && publicAddress) {
                        let created;
                        user = await User.create({ publicAddress, discordID: message.author.id })
                    }
                    if (user && txID) {
                        if (await subscription.add(user, txID)) {
                            message.reply('Subscribed until next week');
                        }
                    }
                    else {
                        message.reply('Something went wrong, try again or send a ticket');
                    }
                } catch (e: any) {
                    if (e.message) {
                        message.reply(e.message);
                    } else {
                        console.log(e);
                    }
                }
            }
            else {
                message.reply('Please, subscribe to use this command');
            }
        }

    });

    // const data = await graphClient.request(query, variables);
    // console.log(JSON.stringify(data, undefined, 2));
}

main().catch((error) => console.error(error));
