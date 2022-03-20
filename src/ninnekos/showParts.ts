import { CommandInteraction } from 'discord.js';
import { parts } from '../parts';
import { AsciiTable3 } from 'ascii-table3';

export default async function showParts(
    type: number,
    interaction: CommandInteraction
) {
    let printable = Object.values(parts)
        .filter((obj) => obj.part === type)
        .map((part) => part.name);
    
    const partName = interaction.options.getSubcommand()?.toUpperCase();

    const table = new AsciiTable3(partName ?? '');

    if (printable?.length) {
        for (let i = 0; i <= printable.length; i += 3) {
            printable?.[i] && table.addRow(
                printable?.[i] ?? '',
                printable?.[i + 1] ?? '',
                printable?.[i + 2] ?? '',
            );
        }
    }
    table.setStyle('none');

    interaction.editReply(`\`${table.toString()}\``);
    console.log(`[SHOW][${partName}]`)
}
