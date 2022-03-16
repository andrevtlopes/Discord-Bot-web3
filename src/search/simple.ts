import { CommandInteraction } from 'discord.js';
import { GraphQLClient } from 'graphql-request';
import { getPartNumber, queryNinnekos } from '../searchHelper';
import { partialParts } from '../utils/types';

export default async function simple(
    graphClient: GraphQLClient,
    interaction: CommandInteraction
): Promise<void> {
    try {
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

        await interaction.reply({
            content: await simpleSearch(graphClient, parts, breed, lifeStage),
            ephemeral: true,
        });
    } catch (e: any) {
        if (e.message) {
            await interaction.reply({ content: e.message, ephemeral: true });
        } else {
            console.log(e);
        }
    }
}

const simpleSearch = async (
    graphClient: GraphQLClient,
    parts: any,
    breed: number | null,
    lifeStage: string | null
): Promise<string> => {
    return await queryNinnekos(
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
    );
};
