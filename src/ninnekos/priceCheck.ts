import { CommandInteraction } from 'discord.js';
import Ninneko from '../models/ninneko.model';
import {
    byId,
    getLifeStage,
    getPartNumber,
    getPetR1R2Prob,
    getR1R2,
} from '../searchHelper';
import { partialParts } from '../utils/types';
// @ts-ignore
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';
import { utils } from 'ethers';
import { factions } from '../parts';
import { Op } from 'sequelize';
import isUserDM from '../utils/isUserDM';

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
    if (breed) parts = { ...parts, breedCount: breed };

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
        .setHeading('BNB', 'FACTION', 'ID', 'B', 'Age', 'H1H2 Weapon', 'H1H2')
        .addRowMatrix(
            ninnekos.map((pet) => [
                parseFloat(utils.formatEther(pet.soldPrice.toString())).toFixed(
                    2
                ),
                byId(factions, pet.faction),
                pet.id,
                pet.breedCount,
                getLifeStage(pet.createdAt),
                getR1R2(pet),
                getPetR1R2Prob(pet) + '%',
            ])
        ).setAligns(AlignmentEnum.RIGHT);

    table.setStyle('none');

    await interaction.editReply(`\`\`\`${table.toString()}\`\`\``);
}
