import { CommandInteraction } from 'discord.js';
import User from '../models/user.model';
import add from './add';

export default async function buySubscription(user: User | null, interaction: CommandInteraction) {
    try {        
        const txID = interaction.options.getString('transaction_id')?.toLowerCase();

        if (!user?.publicAddress) {
            await interaction.reply({ content: 'Please, link a Wallet Address', ephemeral: true });
        } else if (txID && await add(user, txID)) {
            const role = interaction.options.getRole('Subscribed');
            const member = interaction.options.getMember(user.discordID);
            (member?.roles as any).add(role);

            const now = new Date(); //creates date object at current time
            const date = new Date(user.subscriptionDue); //create first state-changing time

            //Execute task after (date - now) milliseconds
            setTimeout(function(){
                console.log('Role ended')
            }, date.getMilliseconds() - now.getMilliseconds());
            await interaction.reply({ content: 'Subscribed until next week', ephemeral: true });
        } else {
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