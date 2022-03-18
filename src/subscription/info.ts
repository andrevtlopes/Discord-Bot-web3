import { CommandInteraction } from 'discord.js';
import User from '../models/user.model';

export default async function info(
    user: User | null,
    interaction: CommandInteraction
) {
    const publicAddress = user?.publicAddress;
    const subscriptionDue = user?.subscriptionDue;
    await interaction.editReply(
        `BEP-20 address: \`${
            publicAddress || 'Please, link an address'
        }\` Subscription due: \`${
            user?.isSubscribed()
                ? subscriptionDue?.toLocaleDateString()
                : 'Not Subscribed'
        }\``
    );
}
