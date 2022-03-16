import { REST } from '@discordjs/rest';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Routes } from 'discord-api-types/v9';
import 'dotenv/config';

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('subscribe')
        .setDescription('Subscribe to the bot!')
        .addStringOption((option) =>
            option
                .setName('transactionid')
                .setDescription('The hash of the transaction')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('bep20address')
                .setDescription(
                    'Address of the sender (only one per discord account can be used)'
                )
                .setRequired(true)
        )
        .toJSON(),
    // Snipe:<MAIN>:<H1 MAIN>:<H2 MAIN>:<EYE>:<H1 EYE>:<H2 EYE>
    // :<TAIL>:<H1 TAIL>:<H2 TAIL>:<HAT>:<H1 HAT>:<H2 HAT>:<SNIPE NAME></SNIPE>
    new SlashCommandBuilder()
        .setName('snipe')
        .setDescription(
            'Receive a private message to know when to snipe (Remember to allow PM)'
        )
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('Snipe Name for identification')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('weapon')
                .setDescription('Weapon Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weaponh1')
                .setDescription('Weapon H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weaponh2')
                .setDescription('Weapon H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eye')
                .setDescription('Eye Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eyeh1')
                .setDescription('Eye H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eyeh2')
                .setDescription('Eye H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hat')
                .setDescription('Hat Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hath1')
                .setDescription('Hat H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hath2')
                .setDescription('Hat H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('tail')
                .setDescription('Tail Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('tailh1')
                .setDescription('Tail H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('tailh2')
                .setDescription('Tail H2 Name')
                .setRequired(false)
        )
        .toJSON(),
        new SlashCommandBuilder()
        .setName('search')
        .setDescription(
            'Search for a ninnekos with H1 and H2 filter sorted by price'
        )
        .addIntegerOption((option) =>
            option
                .setName('breed')
                .setDescription('Breed Quantity')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('lifestage')
                .setDescription('Life Stage of Ninnekos (Adult or New Born)')
                .setRequired(false)
                .setChoices()
        )
        .addStringOption((option) =>
            option
                .setName('weapon')
                .setDescription('Weapon Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weaponh1')
                .setDescription('Weapon H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weaponh2')
                .setDescription('Weapon H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eye')
                .setDescription('Eye Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eyeh1')
                .setDescription('Eye H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eyeh2')
                .setDescription('Eye H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hat')
                .setDescription('Hat Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hath1')
                .setDescription('Hat H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hath2')
                .setDescription('Hat H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('tail')
                .setDescription('Tail Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('tailh1')
                .setDescription('Tail H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('tailh2')
                .setDescription('Tail H2 Name')
                .setRequired(false)
        )
        .toJSON(),
];

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        const res = await rest.put(
            // Routes.applicationGuildCommands(process.env.APPLICATION_ID, '951929724442132520'),
            Routes.applicationCommands(process.env.APPLICATION_ID),
            { body: commands }
        );
        console.log(res);

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
