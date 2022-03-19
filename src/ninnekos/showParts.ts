import { CommandInteraction } from 'discord.js';
import { parts } from '../parts';
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';

export default async function showParts(
    type: number,
    interaction: CommandInteraction
) {
    let printable = Object.values(parts)
        .filter((obj) => obj.part === type)
        .map((part) => part.name);

    const table = new AsciiTable3();

    if (printable?.length) {
        for (let i = 0; i <= printable.length; i += 3) {
            table.addRowMatrix([
                printable?.[i],
                printable?.[i + 1],
                printable?.[i + 2],
            ]);
        }
    }
    table.setAligns(AlignmentEnum.LEFT).setStyle('none');

    interaction.editReply(`\`\`\`${table.toString()}\`\`\``);
}
