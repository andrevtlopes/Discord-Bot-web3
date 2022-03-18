import { GraphQLClient } from 'graphql-request';
import provider from '../utils/provider';
import query from '../query/index';
import printNinneko from '../utils/printNinneko';
import { utils } from 'ethers';
import { Client, TextChannel } from 'discord.js';
import ninnekos from '../ninnekos';

export default function sold(graphClient: GraphQLClient, client: Client) {
    const filterSold = {
        address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
        topics: [
            '0x7bd0b0502f39fae4cc20b3da611aa9e529ffa26435779fe6f2068f197151d9d0',
        ],
    };

    provider.on(filterSold, async (log, event) => {
        if (log) {
            const tokenId = log?.topics[1];
            const variables = {
                id: parseInt(tokenId, 16),
            };
            const now = new Date(); 

            const data = await graphClient.request(query.pet, variables);

            await ninnekos.insertDB(data.pet, graphClient, parseInt(log.data, 16), now);
           
            let channel = client.channels.cache.get('953447957896761384') as TextChannel;
            if (!channel) {
                channel = await client.channels.fetch('953447957896761384') as TextChannel;
            }

            await channel.send({
                embeds: [
                    await printNinneko(
                        data.pet,
                        utils.formatEther(parseInt(log.data, 16).toString())
                    ),
                ],
            });
        }
    });
}