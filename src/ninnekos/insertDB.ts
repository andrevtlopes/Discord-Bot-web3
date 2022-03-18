import { GraphQLClient } from 'graphql-request';
import Ninneko from '../models/ninneko.model';
import query from '../query/index';

export default async function insertDB(
    pet: any,
    graphClient: GraphQLClient,
    price: number | null,
    soldAt: Date | null
) {
    let sold: any = { soldAt: null, soldPrice: null };
    if (price && soldAt) {
        sold = { soldAt, soldPrice: price };
    } else {
        const history = await graphClient.request(query.saleHistory, {
            id: pet.id,
        });
        for (const s of history.saleHistory) {
            soldAt = new Date(s.createdAt);
            if (sold.soldAt === null) {
                sold = { soldAt, soldPrice: s.price };
            } else if (soldAt.getTime() > sold.soldAt.getTime()) {
                sold = { soldAt, soldPrice: s.price };
            }
        }
    }
    await Ninneko.upsert({ ...pet, ...sold });
}
