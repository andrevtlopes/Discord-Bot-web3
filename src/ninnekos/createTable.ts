import { GraphQLClient } from 'graphql-request';
import '../db';
import ninnekos from '.';

(async () => {
    const endpoint = 'https://api.ninneko.com/graphql';

    const graphClient = new GraphQLClient(endpoint, { headers: {} });

    try {
        console.log('Started refreshing ninnekos on DB.');

        await ninnekos.add(graphClient);

        console.log('Successfully refreshed ninnekos on DB.');
    } catch (error) {
        console.error(error);
    }
})();
