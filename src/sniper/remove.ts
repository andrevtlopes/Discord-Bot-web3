import { CommandInteraction } from 'discord.js';
import User from '../models/user.model';

export default async function remove(
    user: User,
    interaction: CommandInteraction
): Promise<void> {
    const snipeName = interaction.options.getString('name');

    if (snipeName) {
        await interaction.editReply({
            content: await removeSnipe(user, snipeName),
            ephemeral: true,
        });
    } else {
        await interaction.editReply({
            content: 'Snipe name is not set',
            ephemeral: true,
        });
    }
}

const removeSnipe = async (user: User, name: string): Promise<string> => {
    const snipes = await user.getSnipes();
    const snipe = snipes.filter((s) => s.name === name);
    if (snipe.length > 0) {
        await user.removeSnipe(snipe[0]);
        return `Snipe removed: ${name}`;
    }

    return 'Failed to remove Snipe, try a valid name';
};
