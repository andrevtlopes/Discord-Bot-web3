import { CommandInteraction } from 'discord.js';
import User from '../models/user.model';
import add from './add';

export default async function subscribe(user: User | null, interaction: CommandInteraction) {
    try {        
        const publicAddress = interaction.options.getString('bep20address')?.toLowerCase();
        const txID = interaction.options.getString('transactionid')?.toLowerCase();

        if (!user && txID && publicAddress) {
            if (interaction.member) {
                user = await User.create({ publicAddress, discordID: interaction.member?.user.id })
            }
        }
        if (user && txID) {
            if (await add(user, txID)) {
                await interaction.reply({ content: 'Subscribed until next week', ephemeral: true });
            }
        }
        else {
            await interaction.reply({ content: 'Something went wrong, try again or send a ticket', ephemeral: true });
        }
    } catch (e: any) {
        if (e.message) {
            await interaction.reply({ content: e.message, ephemeral: true });
        } else {
            console.log(e);
        }
    }
}