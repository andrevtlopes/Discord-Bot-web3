import { CommandInteraction } from 'discord.js';
import Ninneko from '../models/ninneko.model';
import {
    byId,
    getLifeStage,
    getPartName,
    getPartNumber,
} from '../searchHelper';
import { partialParts } from '../utils/types';
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';
import { utils } from 'ethers';
import { factions } from '../parts';
import { Op } from 'sequelize';

export default async function priceCheck(interaction: CommandInteraction) {
    let parts = {};
    for (const part of partialParts) {
        const id = getPartNumber(
            interaction.options.getString(part.discordName),
            part.partId
        );
        if (id) {
            parts = {
                ...parts,
                [part.name]: id === null ? null : [id],
            };
        }
    }

    const breed = interaction.options.getInteger('breed');
    // const lifeStage = interaction.options.getString('lifestage');

    if (breed !== null) parts = { ...parts, breedCount: breed };

    const ninnekos = await Ninneko.findAll({
        where: {
            ...parts,
            soldAt: {
                [Op.ne]: null,
            },
        },
        limit: 10,
        order: [['soldAt', 'DESC']],
    });

    const table = new AsciiTable3()
        .setTitle('Last sold Ninnekos')
        .setHeading('`BNB', 'FACTION', 'ID', 'B', 'Age', 'HAT|TAIL|EYE', 'TIME`')
        .addRowMatrix(
            ninnekos.map((pet) => [
                '`' + parseFloat(utils.formatEther(pet.soldPrice.toString())).toFixed(
                    2
                ),
                byId(factions, pet.faction),
                pet.id,
                pet.breedCount,
                getLifeStage(pet.createdAt),
                // getR1R2(pet),
                `${getPartName(pet.hairD)?.substring(0, 4)}|${getPartName(pet.tailD)?.substring(0, 4)}|${getPartName(pet.eyesD)?.substring(0, 4)}\``,
                `<t:${pet.soldAt.getTime() / 1000}:f>`
            ])
        ).setAligns(AlignmentEnum.RIGHT);

    table.setStyle('none');

    await interaction.editReply(table.toString());
}
