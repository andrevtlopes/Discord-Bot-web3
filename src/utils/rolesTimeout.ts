import { Client, GuildMemberRoleManager } from 'discord.js';
import User from '../models/user.model';

export default async function rolesTimeout(client: Client) {
    const guild = client.guilds.cache.get('951929724442132520');
    const role = guild?.roles.cache.find((r: any) => r.name === 'Subscribed');
    const users = await User.findAll();
    const now = new Date();

    for (const user of users) {
        if (user.isSubscribed()) {
            setTimeout(async function () {
                console.log('Role ended');
                const member = guild?.members.cache.find(member => member.id === user.discordID);
                await (member?.roles as GuildMemberRoleManager)?.remove(role as any);
            }, user.subscriptionDue.getTime() - now.getTime());
        }
    }
}
