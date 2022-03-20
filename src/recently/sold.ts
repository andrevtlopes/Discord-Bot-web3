import { GraphQLClient } from 'graphql-request';
import provider from '../utils/provider';
import query from '../query/index';
import printNinneko from '../utils/printNinneko';
import { utils } from 'ethers';
import { Client, TextChannel } from 'discord.js';
import ninnekos from '../ninnekos';
import { Log } from '@ethersproject/abstract-provider';
import User from '../models/user.model';
import { Op } from 'sequelize';
import soldbyId from './soldById';

export default async function sold(graphClient: GraphQLClient, client: Client) {
    const filterSold = {
        address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
        topics: [
            '0x7bd0b0502f39fae4cc20b3da611aa9e529ffa26435779fe6f2068f197151d9d0',
        ],
    };

    provider.on(filterSold, async (log: Log) => {
        if (log) {
            const tokenId = log?.topics[1];
            const variables = {
                id: parseInt(tokenId, 16),
            };

            const timestamp = new Date(
                (await provider.getBlock(log.blockHash)).timestamp * 1000
            );

            const data = await graphClient.request(query.pet, variables);

            await ninnekos.insertDB(
                data.pet,
                graphClient,
                parseInt(log.data, 16),
                timestamp,
                null,
                null
            );

            let channel = client.channels.cache.get(
                process.env.SOLD_CHANNEL_ID || ''
            ) as TextChannel;
            if (!channel) {
                channel = (await client.channels.fetch(
                    process.env.SOLD_CHANNEL_ID || ''
                )) as TextChannel;
            }

            await channel.send({
                embeds: [
                    printNinneko(
                        data.pet,
                        utils.formatEther(parseInt(log.data, 16).toString())
                    ),
                ],
            });
        }
    });

    const users = await User.findAll({
        where: {
            subscriptionDue: {
                [Op.gt]: new Date(),
            },
        },
    });

    for (const user of users) {
        if (user.discordID) {
            const member = await client.users.fetch(user.discordID);
            if (member) {
                const sellings = await user.getSellings();
                for (const sell of sellings) {
                    await soldbyId(sell, member);
                }
            }
        }
    }
}
