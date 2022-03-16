import { CommandInteraction } from 'discord.js';
import Snipe from '../models/snipe.model';
import User from '../models/user.model';
import { importantPartArray, partTypes } from '../parts';
import { byId, getPartNumber } from '../searchHelper';

export default async function add(user: User, interaction: CommandInteraction) {
    try {
        let parts = {};
        for (const part of importantPartArray) {
            parts = {
                ...parts, [part.name + 'D']: getPartNumber(interaction.options.getString(byId(partTypes, part.id))),
                [part.name + 'R']: getPartNumber(interaction.options.getString(byId(partTypes, part.id) + 'h1')),
                [part.name + 'R1']: getPartNumber(interaction.options.getString(byId(partTypes, part.id) + 'h2'))
            };
        }

        const snipeName = interaction.options.getString('name');

        const countSnipes = await user.countSnipes();

        if (snipeName && countSnipes < 3) {
            await user.createSnipe({ name: snipeName, ...parts });
            await interaction.reply(`Snipe created: ${snipeName}`);
        } else {
            await interaction.reply('You can only add up to 3 Snipes, remove one to add a new one');
        }

        

        // if (!user && txID && publicAddress) {
        //     if (interaction.member) {
        //         user = await User.create({ publicAddress, discordID: interaction.member?.user.id })
        //     }
        // }
        // if (user && txID) {
        //     // if (await checkSnipe(user, txID)) {
        //         // await interaction.reply('Subscribed until next week');
        //     // }
        // }
       
    } catch (e: any) {
        if (e.message) {
            interaction.reply(e.message);
        } else {
            console.log(e);
        }
    }
}