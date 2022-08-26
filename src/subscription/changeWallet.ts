import { CommandInteraction, GuildMemberRoleManager } from 'discord.js';
import { ethers, utils } from 'ethers';
import { bree } from '../index';
import User from '../models/user.model';
import add from './add';
import path from 'path';

export default async function changeWallet(
    user: User | null,
    interaction: CommandInteraction
) {
    const publicAddress = interaction.options.getString('bep20_address');

    if (publicAddress && !utils.isAddress(publicAddress)) {
        await interaction.editReply({
            content: 'Por favor, mande um endereço BEP-20 válido',
        });
    } else {
        if (user?.publicAddress) {
            await interaction.editReply({
                content: 'Wallet já está linkada',
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
                            ? `VIP até <t:${
                                  user?.subscriptionDue.getTime() / 1000
                              }:d>`
                            : 'Agora, compre o vip para ter acesso ao servidor\n`/comprarvip`';

                    if (
                        user?.subscriptionDue.getTime() > new Date().getTime()
                    ) {
                        const guild =
                            interaction.client.guilds.cache.get(
                                '951929724442132520'
                            );
                        const role = guild?.roles.cache.find(
                            (role) => role.name === 'Subscribed'
                        );
                        const member = guild?.members.cache.find(
                            (member) => member.id === interaction.user.id
                        );
                        if (role && member) {
                            await (member?.roles as GuildMemberRoleManager).add(
                                role as any
                            );
                            console.log('[ROLE][ADD][' + interaction.user.username + ']');
                        }
                        // Execute task after (date - now) milliseconds
                        await bree.add({
                            name: interaction.user.username,
                            date: user.subscriptionDue,
                            path: path.join(__dirname, '../../jobs', 'roleTimeout.ts'),
                            worker: {
                                workerData: {
                                    username: interaction.user.username,
                                    discordID: user.discordID,
                                }
                            }
                        });
                        await bree.start(interaction.user.username);
                    }
                    await interaction.editReply(
                        `${publicAddress} linkado ao seu usuario\n\n` + subscribed
                    );
                }
            } else if (user && publicAddress && !user.publicAddress) {
                user.publicAddress = publicAddress.toLowerCase();
                user.save();
                await interaction.editReply({
                    content: `${publicAddress} linkado ao seu usuario`,
                });
                console.log(
                    `[WALLET][${interaction.user.username}] ${publicAddress}`
                );
            } else {
                await interaction.editReply({
                    content: 'Algo deu errado, tente novamente ou abra um ticket com o suporte. <#954042095348375572>',
                });
            }
        }
    }
}
