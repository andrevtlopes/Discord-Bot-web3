import { GraphQLClient } from 'graphql-request';
import query from '../query/index';
import  '../db';
import ninnekos from '.';

(async () => {
    const endpoint = 'https://api.ninneko.com/graphql';

    const graphClient = new GraphQLClient(endpoint, { headers: {} });

    const ids = [22049, 25579, 20739, 22049, 21367, 21351, 11228, 23552, 15297, 22519];

    try {
        console.log('Started refreshing ninnekos on DB.');

        for (const id of ids) {
            const data = await graphClient.request(query.pet, { id });
            console.log(`${data.pet.id} - ${data.pet.name}`);
            await ninnekos.insertDB(
                data.pet,
                graphClient,
                null,
                null,
                null,
                null
            );
        }

        console.log('Successfully refreshed ninnekos on DB.');
    } catch (error) {
        console.error(error);
    }
})();
