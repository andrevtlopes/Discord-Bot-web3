import { CommandInteraction } from 'discord.js';

export default async function isUserDM(interaction: CommandInteraction) {
    let ephemeral = false;
    if (interaction.channel?.type !== 'DM') {
        ephemeral = true;
    }
    await interaction.deferReply({ ephemeral });

    return !ephemeral;
}