import { CommandInteraction } from 'discord.js';
import { ethers, utils } from 'ethers';
import User from '../models/user.model';
import add from './add';

export default async function changeWallet(
    user: User | null,
    interaction: CommandInteraction
) {
    const publicAddress = interaction.options.getString('bep20_address');

    if (publicAddress && !utils.isAddress(publicAddress)) {
        await interaction.editReply({
            content: 'Please, send a valid BEP-20 Address',
        });
    } else {
        if (user?.publicAddress) {
            await interaction.editReply({
                content: 'Wallet already linked',
            });
        } else {
            if (!user && publicAddress) {
                if (interaction.user) {
                    user = await User.create({
                        publicAddress: publicAddress?.toLocaleLowerCase(),
                        discordID: interaction.user.id,
                    });
                    const subscribed =
                        user?.subscriptionDue.getTime() > new Date().getTime()
                            ? `Subscribe until <t:${
                                  user?.subscriptionDue.getTime() / 1000
                              }:d>`
                            : 'Now, subscribe to have access to the bot\n`/subscribe buy`';
                    await interaction.editReply(
                        `${publicAddress} linked to your user\n\n` + subscribed
                    );
                }
            } else if (user && publicAddress && !user.publicAddress) {
                user.publicAddress = publicAddress.toLowerCase();
                user.save();
                await interaction.editReply({
                    content: `${publicAddress} linked to your user`,
                });
                console.log(`[WALLET][${interaction.user.username}] ${publicAddress}`);
            } else {
                await interaction.editReply({
                    content: 'Something went wrong, try again or send a ticket',
                });
            }
        }
    }
}
