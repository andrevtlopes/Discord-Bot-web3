import { GraphQLClient } from 'graphql-request';
import add from './add';

(async () => {
    const endpoint = 'https://api.ninneko.com/graphql';

    const graphClient = new GraphQLClient(endpoint, { headers: {} });

    try {
        console.log('Started refreshing ninnekos on DB.');

        await add(graphClient);
        

        console.log('Successfully refreshed ninnekos on DB.');
    } catch (error) {
        console.error(error);
    }
})();