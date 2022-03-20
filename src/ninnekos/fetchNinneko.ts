import { utils } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import BotError from '../BotError';
import Ninneko from '../models/ninneko.model';
import query from '../query/index';
import printNinneko from '../utils/printNinneko';

export default async function fetchListedNinneko(
    id: number | null,
    graphClient: GraphQLClient
) {
    if (id) {
        const ninneko = await Ninneko.findByPk(id);
        if (!ninneko) {
            const fetchedNinneko = await graphClient.request(query.pet, { id });
            if (fetchedNinneko?.pet) {
                if (
                    fetchedNinneko?.updatedAt &&
                    fetchedNinneko?.forSale === 1
                ) {
                    return printNinneko(
                        fetchedNinneko,
                        utils.formatEther(fetchedNinneko.price.toString()),
                        fetchedNinneko.updatedAt
                    );
                } else {
                    throw new BotError(
                        'Ninneko is not listed on the marketplace!'
                    );
                }
            } else {
                throw new BotError('Ninneko is not available, try another ID');
            }
        } else if (ninneko.listedAt && ninneko.listedPrice) {
            return printNinneko(
                ninneko,
                utils.formatEther(ninneko.listedPrice.toString()),
                ninneko.listedAt
            );
        } else {
            throw new BotError('Ninneko is not listed on the marketplace!');
        }
    }
}
