import './db';
import 'dotenv/config';

import Discord from 'discord.js';
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

        const user = await User.findOne({
            where: { discordID: interaction.user.id || '' },
        });

        const { commandName } = interaction;

        if (user?.isSubscribed()) {
            if (commandName === 'ping') {
                await interaction.reply('Pong!');
            } else if (commandName === 'search') {
                await search.simple(graphClient, interaction);
            } else if (commandName === 'subscribe') {
                const subCommand = interaction.options.getSubcommand();
                if (subCommand === 'info') {
                    // TODO: subscribe info
                    await interaction.reply({
                        content: `\`\`\`Not Implemented\`\`\``,
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({
                        content: 'Already Subscribed',
                        ephemeral: true,
                    });
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
                await interaction.reply({
                    content: `\`\`\`${messages.helpSubscribed}\`\`\``,
                    ephemeral: true,
                });
            } else if (commandName === 'show') {
                // TODO: Implement show functions
                await interaction.reply({
                    content: `\`\`\`Not Implemented\`\`\``,
                    ephemeral: true,
                });
            } else if (commandName === 'price_check') {
                await ninnekos.priceCheck(interaction);
            }
        } else {
            if (commandName === 'subscribe') {
                const subCommand = interaction.options.getSubcommand();
                if (subCommand === 'buy') {
                    await subscription.buySubscription(user, interaction);
                } else if (subCommand === 'wallet') {
                    await subscription.changeWallet(user, interaction);
                } else if (subCommand === 'info') {
                    // TODO: subscribe info
                    await interaction.reply({
                        content: `\`\`\`Not Implemented\`\`\``,
                        ephemeral: true,
                    });
                }
            } else if (commandName === 'help') {
                await interaction.reply({
                    content: `\`\`\`${messages.helpUnsubscribe}\`\`\``,
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: 'Please, subscribe to use this command',
                    ephemeral: true,
                });
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
                '/subscribe': [ 'wallet', 'buy' ],
                '\nIf you need help:': '',
                '/help': ''
            };

            if (user?.isSubscribed()) {
                const newCommands = {
                    '/subscribe': [ 'info' ],
                    '/search': '',
                    '/snipe': ['add', 'remove', 'info'],
                    '/price_check': '',
                    '\nIf you want a list of parts to use with search you can try:':
                       '',
                    '/show': [ 'weapons', 'eyes', 'hats', 'tails' ],
                    '\nIf you need help:': '',
                    '/help': ''
                };
                availableCommands = newCommands as any;
            }

            const commands = [];
            for (const command of Object.keys(availableCommands)) {
                if (typeof (availableCommands as any)[command] !== 'string') {
                    for (const subCommand of (availableCommands as any)[command]) {
                        commands.push(`${command} ${subCommand}`);
                    }
                } else {
                    commands.push(`${command}`);
                }
            }

            msg.channel.send(
                'Available commands:\n```' + commands.join('\n') + '```'
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
