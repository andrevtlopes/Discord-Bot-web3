import { GraphQLClient } from 'graphql-request';
import provider from '../utils/provider';
import User from '../models/user.model';
import query from '../query/index';
import printNinneko from '../utils/printNinneko';
import { utils } from 'ethers';
import { Client, TextChannel } from 'discord.js';
import ninnekos from '../ninnekos';
import { Op } from 'sequelize';

export default function listed(graphClient: GraphQLClient, client: Client) {
    const filterListed = {
        address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
        topics: [
            '0x187f616f90eaf716f9196a8f2eaead21fec5a107062159e6cc7e92b70ba9bca9',
        ],
    };

    provider.on(filterListed, async (log, event) => {
        if (log) {
            const tokenId = log?.topics[1];
            const variables = {
                id: parseInt(tokenId, 16),
            };

            const timestamp = new Date(
                (await provider.getBlock(log.blockHash)).timestamp * 1000
            );

            const data = await graphClient.request(query.pet, variables);
            const pet = data.pet;

            await ninnekos.insertDB(
                data.pet,
                graphClient,
                null,
                null,
                parseInt(log.data, 16),
                timestamp
            );

            let channel = client.channels.cache.get(
                process.env.LISTED_CHANNEL_ID || ''
            ) as TextChannel;
            if (!channel) {
                channel = (await client.channels.fetch(
                    process.env.LISTED_CHANNEL_ID || ''
                )) as TextChannel;
            }

            const ninneko = printNinneko(
                pet,
                utils.formatEther(parseInt(log.data, 16).toString())
            );

            await channel.send({
                embeds: [ninneko],
            });

            const users = await User.findAll({
                where: {
                    subscriptionDue: {
                        [Op.gt]: new Date(),
                    },
                },
            });

            for (const user of users) {
                const snipes = await user.getSnipes();
                if (!user.discordID) {
                    const member = await client.users.fetch(user.discordID);
                    if (member) {
                        for (const snipe of snipes) {
                            if (snipe.compareSnipeWithNinneko(pet)) {
                                await member?.send({
                                    embeds: [ninneko],
                                });
                                console.log(`[SNIPE][${member.username}] ${pet.id}`);
                            }
                        }
                    }
                }
            }

            // TODO: Loop by Users insted of snipes, the overhead is very big in this way
            // const snipes = await Snipe.findAll();

            // for (const snipe of snipes) {
            //     const user = await snipe.getUser();
            //     if (user && user.isSubscribed()) {
            //         const member = await client.users.fetch(user.discordID);
            //         if (snipe.compareSnipeWithNinneko(pet)) {
            //             member?.send({
            //                 embeds: [
            //                     ninneko
            //                 ]
            //             });
            //         }
            //     }
            // }
        }
    });
}
