import Bree from 'bree';
import path from 'path';
import { client } from '../index';
import User from '../models/user.model';

export default async function rolesTimeout(bree: Bree) {
    const users = await User.findAll();

    for (const user of users) {
        const discordUser = await client.users.fetch(user.discordID)
        if (user.isSubscribed() && discordUser) {
            await bree.add({
                name: discordUser.username,
                date: user.subscriptionDue,
                path: path.join(__dirname, '../../jobs', 'roleTimeout.ts'),
                worker: {
                    workerData: {
                        username: discordUser.username,
                        discordID: user.discordID,
                    }
                }
            });
            await bree.start(discordUser.username);
            // setTimeout(async function () {
            //     console.log('Role ended');
            //     const member = guild?.members.cache.find(member => member.id === user.discordID);
            //     await (member?.roles as GuildMemberRoleManager)?.remove(role as any);
            // }, user.subscriptionDue.getTime() - now.getTime());
        }
    }
}
