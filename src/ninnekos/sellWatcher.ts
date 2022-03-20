import { CommandInteraction } from 'discord.js';
import { GraphQLClient } from 'graphql-request';
import BotError from '../BotError';
import fetchNinneko from './fetchNinneko';
import User from '../models/user.model';
import soldbyId from '../recently/soldById';

export default async function sellWatcher(user: User, interaction: CommandInteraction, graphClient: GraphQLClient) {
    const id = interaction.options.getInteger('id');
    const fetchedNinneko = await fetchNinneko(id, graphClient);
    if (fetchedNinneko && id) {
        if (await user.countSellings() >= 15) {
            throw new BotError('You`ve reached the maximum watchers, you can remove a watcher if you want to add a new one');
        }

        const sell = await user.createSelling({ ninnekoId: id });
        await soldbyId(sell, interaction.user);
    
        await interaction.editReply({ embeds: [fetchedNinneko] });
        await interaction.followUp('The bot will send you a message if your ninneko is sold!');
        console.log(`[WATCHER][${interaction.user.username}] ${id}`)
    }
}
