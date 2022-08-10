import { REST } from '@discordjs/rest';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Routes } from 'discord-api-types/v9';
import 'dotenv/config';

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN ?? '');

const commands = [
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Useful informations about the bot usage!')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('show')
        .setDescription('Show Ninneko part names to help use bot tools!')
        .addSubcommand((sub) =>
            sub.setName('weapons').setDescription('Show Ninneko Weapon names')
        )
        .addSubcommand((sub) =>
            sub.setName('eyes').setDescription('Show Ninneko Eye names')
        )
        .addSubcommand((sub) =>
            sub.setName('hats').setDescription('Show Ninneko Hat names')
        )
        .addSubcommand((sub) =>
            sub.setName('tails').setDescription('Show Ninneko Tail names')
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('subscribe')
        .setDescription('Subscribe to the bot!')
        .addSubcommand((sub) =>
            sub
                .setName('wallet')
                .setDescription('Link a BEP-20 Wallet to your discord user')
                .addStringOption((option) =>
                    option
                        .setName('bep20_address')
                        .setDescription(
                            'Address of the sender (only one per discord account can be used)'
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName('buy')
                .setDescription('Add transaction informations')
                .addStringOption((option) =>
                    option
                        .setName('transaction_id')
                        .setDescription(
                            'The hash of the transaction you`ve made'
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName('info')
                .setDescription(
                    'Information about your subscription and wallet'
                )
        )
        .toJSON(),
    // Snipe:<MAIN>:<H1 MAIN>:<H2 MAIN>:<EYE>:<H1 EYE>:<H2 EYE>
    // :<TAIL>:<H1 TAIL>:<H2 TAIL>:<HAT>:<H1 HAT>:<H2 HAT>:<SNIPE NAME></SNIPE>
    new SlashCommandBuilder()
        .setName('snipe')
        .setDescription(
            'Receive a private message to know when to snipe (Remember to allow DM)'
        )
        .addSubcommand((sub) =>
            sub
                .setName('add')
                .setDescription(
                    'Add new snipe with provided ninneko parts information (Up to 3)'
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
                        .setName('weapon_h1')
                        .setDescription('Weapon H1 Name')
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('weapon_h2')
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
                        .setName('eye_h1')
                        .setDescription('Eye H1 Name')
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('eye_h2')
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
                        .setName('hat_h1')
                        .setDescription('Hat H1 Name')
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('hat_h2')
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
                        .setName('tail_h1')
                        .setDescription('Tail H1 Name')
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('tail_h2')
                        .setDescription('Tail H2 Name')
                        .setRequired(false)
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName('remove')
                .setDescription('Remove a Snipe using its name')
                .addStringOption((option) =>
                    option
                        .setName('name')
                        .setDescription(
                            'Snipe name (use check if you forget the name of the snipe)'
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('info').setDescription('Show the current Snipes')
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('search')
        .setDescription(
            'Search for Ninnekos with H1 and H2 filter sorted by price'
        )
        .addIntegerOption((option) =>
            option
                .setName('breed')
                .setDescription('Breed Quantity')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('life_stage')
                .setDescription('Life Stage of Ninnekos (Adult or New Born)')
                .setRequired(false)
                .setChoices([
                    ['Adult', 'adult'],
                    ['New Born', 'new born'],
                ])
        )
        .addStringOption((option) =>
            option
                .setName('faction')
                .setDescription('Faction of Ninnekos')
                .setRequired(false)
                .setChoices([
                    ['Thunder', 'thunder'],
                    ['Fire', 'fire'],
                    ['Earth', 'earth'],
                    ['Wind', 'wind'],
                    ['Water', 'water'],
                    ['YinYang', 'yinyang'],
                ])
        )
        .addStringOption((option) =>
            option
                .setName('weapon')
                .setDescription('Weapon Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weapon_h1')
                .setDescription('Weapon H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weapon_h2')
                .setDescription('Weapon H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option.setName('eye').setDescription('Eye Name').setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eye_h1')
                .setDescription('Eye H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eye_h2')
                .setDescription('Eye H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option.setName('hat').setDescription('Hat Name').setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hat_h1')
                .setDescription('Hat H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hat_h2')
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
                .setName('tail_h1')
                .setDescription('Tail H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('tail_h2')
                .setDescription('Tail H2 Name')
                .setRequired(false)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('time_listed')
        .setDescription(
            'Show the time the Ninneko was listed on the marketplace'
        )
        .addIntegerOption((option) =>
            option.setName('id').setDescription('Ninneko ID').setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('sell_watcher')
        .setDescription('Send a message when your Ninneko is sold')
        .addIntegerOption((option) =>
            option.setName('id').setDescription('Ninneko ID').setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('price_check')
        .setDescription(
            'Search for the last 10 sold ninnekos that matches the given parameters'
        )
        .addIntegerOption((option) =>
            option
                .setName('breed')
                .setDescription('Breed Quantity')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weapon')
                .setDescription('Weapon Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weapon_h1')
                .setDescription('Weapon H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weapon_h2')
                .setDescription('Weapon H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option.setName('eye').setDescription('Eye Name').setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eye_h1')
                .setDescription('Eye H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eye_h2')
                .setDescription('Eye H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option.setName('hat').setDescription('Hat Name').setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hat_h1')
                .setDescription('Hat H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hat_h2')
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
                .setName('tail_h1')
                .setDescription('Tail H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('tail_h2')
                .setDescription('Tail H2 Name')
                .setRequired(false)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('average')
        .setDescription('Price average of listed and sold Ninnekos')
        .addIntegerOption((option) =>
            option
                .setName('breed')
                .setDescription('Breed Quantity')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weapon')
                .setDescription('Weapon Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weapon_h1')
                .setDescription('Weapon H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('weapon_h2')
                .setDescription('Weapon H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option.setName('eye').setDescription('Eye Name').setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eye_h1')
                .setDescription('Eye H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('eye_h2')
                .setDescription('Eye H2 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option.setName('hat').setDescription('Hat Name').setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hat_h1')
                .setDescription('Hat H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('hat_h2')
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
                .setName('tail_h1')
                .setDescription('Tail H1 Name')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('tail_h2')
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
            Routes.applicationCommands(process.env.APPLICATION_ID ?? ''),
            { body: commands }
        );
        console.log(res);

        // delete all commands
        // const data = await rest.get(Routes.applicationCommands(process.env.APPLICATION_ID));
        // for (const command of data) {
        //     const deleteUrl = `${Routes.applicationCommands(process.env.APPLICATION_ID)}/${command.id}`;
        //     await rest.delete(deleteUrl);
        // }

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
