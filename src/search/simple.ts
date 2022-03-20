import { CommandInteraction } from 'discord.js';
import { GraphQLClient } from 'graphql-request';
import { getNinnekoTable, getPartNumber, queryNinnekos } from '../searchHelper';
import { partialParts } from '../utils/types';

export default async function simple(
    graphClient: GraphQLClient,
    interaction: CommandInteraction
): Promise<void> {
    let parts = {};
    for (const part of partialParts) {
        const id = getPartNumber(
            interaction.options.getString(part.discordName),
            part.partId
        );
        parts = {
            ...parts,
            [part.name]: id === null ? null : [id],
        };
    }

    const breed = interaction.options.getInteger('breed');
    const lifeStage = interaction.options.getString('lifestage');

    await interaction.editReply({
        content: '```' + await simpleSearch(graphClient, parts, breed, lifeStage) + '```',
    });
}

const simpleSearch = async (
    graphClient: GraphQLClient,
    parts: any,
    breed: number | null,
    lifeStage: string | null
): Promise<string> => {
    return getNinnekoTable(await queryNinnekos(
        {
            // @ts-ignore
            breed,
            parts,
            // @ts-ignore
            lifeStage,
            // @ts-ignore
            sort: 'price',
        },
        graphClient
    )).toString();
};
