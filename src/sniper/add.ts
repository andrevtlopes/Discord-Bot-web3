import { CommandInteraction } from 'discord.js';
import Snipe from '../models/snipe.model';
import User from '../models/user.model';
import { importantPartArray, partTypes } from '../parts';
import { byId, getPartNumber } from '../searchHelper';

export default async function add(user: User, interaction: CommandInteraction): Promise<void> {
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

        if (snipeName) {
            await interaction.reply({ content: await addSnipe(user, snipeName, parts), ephemeral: true })
        } else {
            await interaction.reply({ content: 'Snipe name is not set', ephemeral: true })
        }
    } catch (e: any) {
        if (e.message) {
            await interaction.reply({ content: e.message, ephemeral: true });
        } else {
            console.log(e);
        }
    }
}

const addSnipe = async (user: User, name: string, parts: any): Promise<string> => {
    const countSnipes = await user.countSnipes();

    if (countSnipes < 3) {
        await user.createSnipe({ name: name, ...parts });
        return `Snipe created: ${name}`;
    } else {
        return 'You can only add up to 3 Snipes, remove one to add a new one';
    }
}