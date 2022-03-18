import { CommandInteraction } from "discord.js";
import { parts } from "../parts";

export default async function showParts(type: number, interaction: CommandInteraction) {
    const printable = Object.values(parts).filter(
        (obj) => obj.part === type
    );

    interaction.editReply(`\`\`\`${printable.join('\t')}\`\`\``);
}