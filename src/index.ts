import './db';
import 'dotenv/config';

import Discord, { CommandInteraction } from 'discord.js';
import { GraphQLClient } from 'graphql-request';
import search from './search';
import subscription from './subscription';
import User from './models/user.model';
import sniper from './sniper';
import { sequelize } from './db';
import recently from './recently';
import messages from './utils/messages';
import rolesTimeout from './utils/rolesTimeout';
import ninnekos from './ninnekos';
import BotError from './BotError';
import isUserDM from './utils/isUserDM';
import { partTypes } from './parts';

async function main() {
    let disableRecently = false;
    if (process.env.NODE_ENV !== 'production') {
        disableRecently = true;
        console.log('Recently disabled!');
    }
    const client = new Discord.Client({
        intents: [
            'GUILDS',
            'GUILD_MESSAGES',
            'DIRECT_MESSAGES',
            'GUILD_PRESENCES',
        ],
        partials: ['CHANNEL'],
    });
    client.login(process.env.BOT_TOKEN);
    await rolesTimeout(client);

    const endpoint = 'https://api.ninneko.com/graphql';

    const graphClient = new GraphQLClient(endpoint, { headers: {} });

    client.on('ready', async () => {
        console.log('Connected to discord bot');
    });

    if (!disableRecently) {
        recently.listed(graphClient, client);
        recently.sold(graphClient, client);
    }

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        try {
            await isUserDM(interaction);

            const user = await User.findOne({
                where: { discordID: interaction.user.id || '' },
            });

            const { commandName } = interaction;

            if (user?.isSubscribed()) {
                if (commandName === 'ping') {
                    await interaction.editReply('Pong!');
                } else if (commandName === 'search') {
                    await search.simple(graphClient, interaction);
                } else if (commandName === 'subscribe') {
                    const subCommand = interaction.options.getSubcommand();
                    if (subCommand === 'info') {
                        await subscription.info(user, interaction);
                    } else {
                        await interaction.editReply('Already Subscribed');
                    }
                } else if (commandName === 'snipe') {
                    const subCommand = interaction.options.getSubcommand();
                    if (subCommand === 'add') {
                        await sniper.add(user, interaction);
                    } else if (subCommand === 'remove') {
                        await sniper.remove(user, interaction);
                    } else if (subCommand === 'info') {
                        await sniper.check(user, interaction);
                    }
                } else if (commandName === 'help') {
                    await interaction.editReply(
                        `\`\`\`${messages.helpSubscribed}\`\`\`` +
                            '\nTo see how to use this functions, please go to <#954038774860492860>'
                    );
                } else if (commandName === 'show') {
                    const subCommand = interaction.options.getSubcommand();
                    const part = subCommand.slice(0, -1);
                    await ninnekos.showParts(
                        (partTypes as any)[part],
                        interaction
                    );
                } else if (commandName === 'price_check') {
                    await ninnekos.priceCheck(interaction);
                } else if (commandName === 'time_listed') {
                    await ninnekos.listedTime(interaction, graphClient);
                } else if (commandName === 'average') {
                    await ninnekos.averagePrice(interaction);
                }
            } else {
                if (commandName === 'subscribe') {
                    const subCommand = interaction.options.getSubcommand();
                    if (subCommand === 'buy') {
                        await subscription.buySubscription(user, interaction);
                    } else if (subCommand === 'wallet') {
                        await subscription.changeWallet(user, interaction);
                    } else if (subCommand === 'info') {
                        await subscription.info(user, interaction);
                    }
                } else if (commandName === 'help') {
                    await interaction.editReply(
                        `\`\`\`${messages.helpUnsubscribe}\`\`\`` +
                            '\nTo see how to use this functions, please go to <#954038774860492860>'
                    );
                } else {
                    await interaction.editReply(
                        'Please, subscribe to use this command'
                    );
                }
            }
        } catch (e: any) {
            if (e instanceof BotError) {
                await interaction.editReply({ content: e.message });
            } else {
                try {
                    const reply =
                        'Something went wrong, try again or send a help ticket. <#954042095348375572>';
                    if (interaction.replied) {
                        await interaction.editReply(reply);
                    } else {
                        await interaction.followUp(reply);
                    }
                } catch (e: any) {
                    if (e?.message) {
                        console.log(e.message);
                    } else {
                        console.error(e);
                    }
                }
            }
            if (e?.message) {
                console.log(e.message);
            } else {
                console.error(e);
            }
        }
    });

    client.on('messageCreate', async (msg) => {
        if (msg.author.bot) return;
        if (msg.channel.type === 'DM') {
            const user = await User.findOne({
                where: { discordID: msg.author.id || '' },
            });
            let availableCommands = {
                'This is a private bot that need to be bought.': '',
                '\nTo buy the bot please type:': '',
                '/subscribe': ['wallet'],
                '\nAfter linking your wallet to the bot you can:': '',
                '/subscribe ': ['buy'],
                '\nTo buy acess to the bot.': '',
                '\nFor more help type:': '',
                '/help': '',
            };

            if (user?.isSubscribed()) {
                const newCommands = {
                    '/subscribe': ['info'],
                    '/search': '',
                    '/snipe': ['add', 'remove', 'info'],
                    '/price_check': '',
                    '\nIf you are in doubt about the ninneko parts you can check here:':
                        '',
                    '/show': ['weapons', 'eyes', 'hats', 'tails'],
                    '\nIf you need help:': '',
                    '/help': '',
                };
                availableCommands = newCommands as any;
            }

            const commands = [];
            for (const command of Object.keys(availableCommands)) {
                if (typeof (availableCommands as any)[command] !== 'string') {
                    for (const subCommand of (availableCommands as any)[
                        command
                    ]) {
                        commands.push(`${command} ${subCommand}`);
                    }
                } else {
                    commands.push(`${command}`);
                }
            }

            msg.channel.send(
                'Available commands:\n```' +
                    commands.join('\n') +
                    '```' +
                    '\nTo see how to use this functions, please go to <#954038774860492860>'
            );
        }

        // you can do anything you want here. In my case I put console.log() function.
        // since you wanted user ID, you can use msg.author.id property here.

        // }
    });

    client.on('guildMemberAdd', async (member) => {
        member.send(`\`\`\`${messages.welcome}\`\`\``);
    });

    // client.on('messageCreate', async function (message) {
    //     if (message.author.bot) return;
    //     if (!message.content.startsWith(prefix)) return;

    //     const commandBody = message.content.slice(prefix.length);
    //     const args = commandBody.split('@');
    //     const command = args?.shift()?.toLowerCase();

    //     let user = await User.findOne({
    //         where: { discordID: message.author.id },
    //     });
    //     if (user?.isSubscribed()) {
    //         if (command === 'ping') {
    //             const timeTaken = Date.now() - message.createdTimestamp;
    //             message.reply(
    //                 `Pong! This message had a latency of ${timeTaken}ms.`
    //             );
    //         }
    //         // search@Faction:Class:Breed:LifeStage:Parts:Sort,
    //         // Parts: weapon, tail, eye, hat, ear, mouth
    //         else if (command === 'search') {
    //             message.reply(await search(args, graphClient));
    //         } else if (command === 'simple') {
    //             message.reply(await simpleSearch(args, graphClient));
    //         }
    //     } else {
    //         if (command === 'subscribe') {
    //         }
    //     }
    // });

    // Create new tables
    await sequelize.sync();

    // const data = await graphClient.request(query, variables);
    // console.log(JSON.stringify(data, undefined, 2));
}

main().catch((error) => console.error(error));
