import { GraphQLClient } from 'graphql-request';
import ninnekos from '.';
import query from '../query/index';

// Primeiro rodar o recently sold
// Depois rodar esse

export default async function add(graphClient: GraphQLClient) {
    const variables = {
        limit: 50,
        forSale: null,
        sortID: false
    };
    let page = 0;
    while (true) {
        const data = await graphClient.request(query.pets, { ...variables, page });
        page = page + 1;

        console.log('Pet Length: ' + data.pets.length);

        if (data.pets.length === 0) break;

        for (const pet of data.pets) {
            await ninnekos.insertDB(pet, graphClient, null, null);
        }
    }
    
}