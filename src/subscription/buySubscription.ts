import { CommandInteraction, GuildMemberRoleManager, RoleResolvable } from 'discord.js';
import User from '../models/user.model';
import add from './add';

export default async function buySubscription(user: User | null, interaction: CommandInteraction) {
    try {        
        const txID = interaction.options.getString('transaction_id')?.toLowerCase();
        await interaction.reply({ content: 'Working on it!', ephemeral: true });

        if (!user?.publicAddress) {
            await interaction.editReply({ content: 'Please, link a Wallet Address' });
        } else if (txID && await add(user, txID)) {
            const guild = interaction.client.guilds.cache.get('951929724442132520');
            const role = guild?.roles.cache.find(role => role.name === 'Subscribed');
            const member = guild?.members.cache.find(member => member.id === user.discordID);
            if (role && member) {
                await (member?.roles as GuildMemberRoleManager).add(role as any);
            }

            const now = new Date(); //creates date object at current time

            await interaction.editReply({ content: 'Subscribed until next week' });

            // Execute task after (date - now) milliseconds
            setTimeout(async function(){
                console.log('Role ended');
                await (member?.roles as GuildMemberRoleManager).remove(role as any);
            }, user.subscriptionDue.getTime() - now.getTime());
        } else {
            await interaction.editReply({ content: 'Something went wrong, try again or send a ticket' });
        }
    } catch (e: any) {
        if (e.message) {
            await interaction.editReply({ content: e.message });
        } else {
            console.log(e);
        }
    }
}