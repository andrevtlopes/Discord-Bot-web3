import { CommandInteraction } from 'discord.js';
import { utils } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import ninnekos from '.';
import BotError from '../BotError';
import Ninneko from '../models/ninneko.model';
import query from '../query/index';
import printNinneko from '../utils/printNinneko';

export default async function listedTime(
    interaction: CommandInteraction,
    graphClient: GraphQLClient
) {
    const id = interaction.options.getInteger('id');

    if (id) {
        const ninneko = await Ninneko.findByPk(id);
        if (!ninneko) {
            const fetchedNinneko = await graphClient.request(query.pet, { id });
            if (fetchedNinneko?.pet) {
                if (
                    fetchedNinneko?.updatedAt &&
                    fetchedNinneko?.forSale === 1
                ) {
                    await interaction.editReply({
                        embeds: [
                            printNinneko(
                                fetchedNinneko,
                                utils.formatEther(
                                    fetchedNinneko.price.toString()
                                ),
                                fetchedNinneko.updatedAt
                            ),
                        ],
                    });
                } else {
                    throw new BotError('Ninneko is not listed on the marketplace!');
                }
            } else {
                throw new BotError('Ninneko is not available, try another ID');
            }
        } else if (ninneko.listedAt && ninneko.listedPrice) {
            await interaction.editReply({
                embeds: [
                    printNinneko(
                        ninneko,
                        utils.formatEther(ninneko.listedPrice.toString()),
                        ninneko.listedAt
                    ),
                ],
            });
        } else {
            throw new BotError('Ninneko is not listed on the marketplace!');
        }
    }
}
