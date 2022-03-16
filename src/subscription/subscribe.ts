import { CommandInteraction } from 'discord.js';
import User from '../models/user.model';
import add from './add';

export default async function subscribe(user: User | null, interaction: CommandInteraction) {
    try {        
        const publicAddress = interaction.options.getString('bep20address');
        const txID = interaction.options.getString('transactionid');

        if (!user && txID && publicAddress) {
            if (interaction.member) {
                user = await User.create({ publicAddress, discordID: interaction.member?.user.id })
            }
        }
        if (user && txID) {
            if (await add(user, txID)) {
                await interaction.reply('Subscribed until next week');
            }
        }
        else {
            await interaction.reply('Something went wrong, try again or send a ticket');
        }
    } catch (e: any) {
        if (e.message) {
            interaction.reply(e.message);
        } else {
            console.log(e);
        }
    }
}