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
                    await interaction.editReply({
                        content: `${publicAddress} linked to your user`,
                    });
                }
            } else if (user && publicAddress && !user.publicAddress) {
                user.publicAddress = publicAddress.toLowerCase();
                user.save();
                await interaction.editReply({
                    content: `${publicAddress} linked to your user`,
                });
            } else {
                await interaction.editReply({
                    content: 'Something went wrong, try again or send a ticket',
                });
            }
        }
    }
}
