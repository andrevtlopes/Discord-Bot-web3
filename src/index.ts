import './db';
import 'dotenv/config';

import Discord, { MessageEmbed, TextChannel } from 'discord.js';
import { GraphQLClient, gql } from 'graphql-request';
import search from './search';
import breed from './breed';
import simpleSearch from './simpleSearch';
import { utils } from 'ethers';
import query from './query/index';
import { byId, getLifeStage, getPartName } from './searchHelper';
import { importantPartArray, partArray, partTypes } from './parts';
// @ts-ignore
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';

import { factions } from './utils/types';
import provider from './utils/provider';
import subscription from './subscription';
import User from './models/user.model';
import sniper from './sniper';
import printNinneko from './utils/printNinneko';
import { sequelize } from './db';
import Snipe from './models/snipe.model';

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

            const data = await graphClient.request(query.pet, variables);
            const pet = data.pet;

            (
                client.channels.cache.get('953447957896761384') as TextChannel
            ).send({
                embeds: [
                    await printNinneko(
                        pet,
                        utils.formatEther(parseInt(log.data, 16).toString())
                    ),
                ],
            });
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

            const ninneko = await printNinneko(
                pet,
                utils.formatEther(parseInt(log.data, 16).toString())
            );

            (
                client.channels.cache.get('952338766511628378') as TextChannel
            ).send({
                embeds: [
                    ninneko
                ]
            });

            const snipes = await Snipe.findAll();

            for (const snipe of snipes) {
                const user = await snipe.getUser();
                if (user && user.isSubscribed()) {
                    const member = await client.users.fetch(user.discordID);
                    if (snipe.compareSnipeWithNinneko(pet)) {
                        member?.send({
                            embeds: [
                                ninneko
                            ]
                        });
                    }
                }
            }
        }
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        const user = await User.findOne({
            where: { discordID: interaction.member?.user.id },
        });

        const { commandName } = interaction;

        if (user?.isSubscribed()) {
            if (commandName === 'ping') {
                await interaction.reply('Pong!');
            } else if (commandName === 'subscribe') {
                await interaction.reply('Already Subscribed');
            } else if (commandName === 'snipe') {
                await sniper.add(user, interaction);
            } else if (commandName === 'snipecheck') {
                await sniper.check();
            } else if (commandName === 'sniperemove') {
                await sniper.remove();
            }
        } else {
            if (commandName === 'subscribe') {
                await subscription.subscribe(user, interaction);
            } else {
                await interaction.reply(
                    'Please, subscribe to use this command'
                );
            }
        }
    });

    client.on('messageCreate', async function (message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split('@');
        const command = args?.shift()?.toLowerCase();

        let user = await User.findOne({
            where: { discordID: message.author.id },
        });
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
        } else {
            if (command === 'subscribe') {
            }
        }
    });

    // Create new tables
    await sequelize.sync();

    // const data = await graphClient.request(query, variables);
    // console.log(JSON.stringify(data, undefined, 2));
}

main().catch((error) => console.error(error));
