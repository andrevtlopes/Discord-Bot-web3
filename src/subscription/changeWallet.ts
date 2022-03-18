import { CommandInteraction } from 'discord.js';
import { ethers, utils } from 'ethers';
import User from '../models/user.model';
import add from './add';

export default async function changeWallet(user: User | null, interaction: CommandInteraction) {
    try {        
        const publicAddress = interaction.options.getString('bep20_address');

        if (publicAddress && !utils.isAddress(publicAddress)) {
            await interaction.reply({ content: 'Please, send a valid BEP-20 Address', ephemeral: true });
        } else {
            if (user?.publicAddress) {
                await interaction.reply({ content: 'Wallet already linked', ephemeral: true });
            } else {
                if (!user && publicAddress) {
                    if (interaction.user) {
                        user = await User.create({ publicAddress: publicAddress?.toLocaleLowerCase(), discordID: interaction.user.id });
                        await interaction.reply({ content: `${publicAddress} linked to your user`, ephemeral: true });
                    }
                } else if (user && publicAddress && !user.publicAddress) {
                    user.publicAddress = publicAddress.toLowerCase();
                    user.save();
                    await interaction.reply({ content: `${publicAddress} linked to your user`, ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Something went wrong, try again or send a ticket', ephemeral: true });
                }
            }
        }
    } catch (e: any) {
        if (e.message) {
            await interaction.reply({ content: e.message, ephemeral: true });
        } else {
            console.log(e);
        }
    }
}