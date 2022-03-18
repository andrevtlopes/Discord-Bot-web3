import { GraphQLClient } from 'graphql-request';
import provider from '../utils/provider';
import Snipe from '../models/snipe.model';
import query from '../query/index';
import printNinneko from '../utils/printNinneko';
import { utils } from 'ethers';
import { Client, TextChannel } from 'discord.js';

export default async function listed(graphClient: GraphQLClient, client: Client) {
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

            const data = await graphClient.request(query.pet, variables);
            const pet = data.pet;

            const ninneko = await printNinneko(
                pet,
                utils.formatEther(parseInt(log.data, 16).toString())
            );

            let channel = client.channels.cache.get('952338766511628378') as TextChannel;
            if (!channel) {
                channel = await client.channels.fetch('952338766511628378') as TextChannel;
            }

            await channel.send({
                embeds: [
                    ninneko
                ]
            });

            // TODO: Loop by Users insted of snipes, the overhead is very big in this way
            const snipes = await Snipe.findAll();


            for (const snipe of snipes) {
                const user = await snipe.getUser();
                if (user && user.isSubscribed()) {
                    const member = await client.users.fetch(user.discordID);
                    if (snipe.compareSnipeWithNinneko(pet)) {
                        member?.send({
                            embeds: [
                                ninneko
                            ]
                        });
                    }
                }
            }
        }
    });
}