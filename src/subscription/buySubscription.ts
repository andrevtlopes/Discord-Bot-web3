import {
    CommandInteraction,
    GuildMemberRoleManager,
} from 'discord.js';
import User from '../models/user.model';
import add from './add';

export default async function buySubscription(
    user: User | null,
    interaction: CommandInteraction
) {
    const username = interaction.user.username;
    const txID = interaction.options.getString('transaction_id')?.toLowerCase();
    await interaction.editReply({ content: 'Working on it!' });
    console.info(`[INFO][${username}] txID: ${txID}`);

    if (!user?.publicAddress) {
        await interaction.editReply({
            content: 'Please, link a Wallet Address',
        });
    } else if (txID && (await add(user, txID))) {
        const guild = interaction.client.guilds.cache.get('951929724442132520');
        const role = guild?.roles.cache.find(
            (role) => role.name === 'Subscribed'
        );
        const member = guild?.members.cache.find(
            (member) => member.id === user.discordID
        );
        if (role && member) {
            await (member?.roles as GuildMemberRoleManager).add(role as any);
        }

        const now = Date.now(); //creates date object at current time

        // subscriptionDue = now + 7 days
        user.subscriptionDue = new Date(now + 7 * 24 * 60 * 60 * 1000);
        user.save();

        await interaction.editReply({ content: 'Subscribed until next week' });
        console.log(`[SUBSCRIBE][${username}]`);

        // Execute task after (date - now) milliseconds
        setTimeout(async function () {
            console.log('Role ended');
            await (member?.roles as GuildMemberRoleManager).remove(role as any);
        }, user.subscriptionDue.getTime() - now);
    } else {
        await interaction.editReply({
            content: 'Something went wrong, try again or send a ticket',
        });
    }
}
