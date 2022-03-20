import { CommandInteraction } from 'discord.js';
import { utils } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import Ninneko from '../models/ninneko.model';
import { getPartNumber } from '../searchHelper';
import { partialParts } from '../utils/types';
import { sequelize } from '../db';
import moment from 'moment';
import { Op } from 'sequelize';
import { parseEther } from 'ethers/lib/utils';

export default async function averagePrice(interaction: CommandInteraction) {
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

    let search: any = {};
    if (breed !== null) search = { ...search, breedCount: breed };

    const averages = [];
    for (const days of [7, 30, null]) {
        const datetime = moment().subtract(days, 'days');

        let soldAt = {};
        let listedAt = {};

        if (days) {
            soldAt = { soldAt: { [Op.gte]: datetime.toDate() } };
            listedAt = { listedAt: { [Op.gte]: datetime.toDate() } };
        }

        averages.push([
            (
                await Ninneko.findAll({
                    attributes: [
                        [
                            sequelize.fn('avg', sequelize.col('soldPrice')),
                            'soldPrice',
                        ],
                    ],
                    where: {
                        ...parts,
                        ...search,
                        ...soldAt,
                        soldPrice: {
                            [Op.lt]: parseEther(
                                process.env.IGNORE_ABOVE_BNB || '11'
                            ).toBigInt(),
                        },
                    },
                })
            )[0].soldPrice,
            (
                await Ninneko.findAll({
                    attributes: [
                        [
                            sequelize.fn('avg', sequelize.col('listedPrice')),
                            'listedPrice',
                        ],
                    ],
                    where: {
                        ...parts,
                        ...search,
                        ...listedAt,
                        listedPrice: {
                            [Op.lt]: parseEther(
                                process.env.IGNORE_ABOVE_BNB || '11'
                            ).toBigInt(),
                        },
                    },
                })
            )[0].listedPrice,
        ]);
    }

    const averageListed: string[] = [];
    const averageSold: string[] = [];

    for (const average of averages) {
        average[0] &&
            averageSold.push(
                parseFloat(utils.formatEther(average[0].toString())).toFixed(2)
            );
        average[1] &&
            averageListed.push(
                parseFloat(utils.formatEther(average[1].toString())).toFixed(2)
            );
    }

    interaction.editReply(`Average price for sold Ninnekos:
    \`Last 7 days:  ${averageSold[0]} BNB\`
    \`Last 30 days: ${averageSold[1]} BNB\`
    \`All sold:     ${averageSold[2]} BNB\`
Average price for currently listed Ninnekos:
    \`Last 7 days:  ${averageListed[0]} BNB\`
    \`Last 30 days: ${averageListed[1]} BNB\`
    \`All listed:   ${averageListed[2]} BNB\`
    `);
}
