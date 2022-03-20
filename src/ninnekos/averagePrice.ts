import { CommandInteraction } from 'discord.js';
import { BigNumber, utils } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import ninnekos from '.';
import BotError from '../BotError';
import Ninneko from '../models/ninneko.model';
import query from '../query/index';
import { getPartNumber, queryNinnekos } from '../searchHelper';
import printNinneko from '../utils/printNinneko';
import { partialParts } from '../utils/types';
import { Sequelize } from 'sequelize';
import { sequelize } from '../db';

export default async function averagePrice(
    interaction: CommandInteraction,
    graphClient: GraphQLClient
) {
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
    const fromDate = interaction.options.getString('from');
    const toDate = interaction.options.getString('to');

    let search: any = {};
    if (breed !== null) search = { ...search, breedCount: breed };
    // if (fromDate) {
    //     search = Sequelize.and(...search, Sequelize.or() );
    // }
    // if (toDate) {
    //     search = { ...search, listedAt: { lte: new Date(toDate) } };
    // }

    const averages = await Ninneko.findAll({
        attributes: [
            [sequelize.fn('avg', sequelize.col('soldPrice')), 'soldPrice'],
            [
                sequelize.fn('avg', sequelize.col('listedPrice')),
                'listedPrice',
            ],
        ],
        where: Sequelize.and(parts, search),
    });

    const averageListed = parseFloat(utils.formatEther(averages[0].getDataValue('listedPrice').toString())).toFixed(2);
    const averageSold = parseFloat(utils.formatEther(averages[0].getDataValue('soldPrice').toString())).toFixed(2);


    interaction.editReply(`Average price for sold Ninnekos is: \`${averageSold} BNB\`
Average price for listed Ninnekos is: \`${averageListed} BNB\``);
}
