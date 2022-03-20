import { GraphQLClient } from 'graphql-request';
import ninnekos from '../ninnekos';
import query from '../query/index';
import provider from './provider';

export default async function getMissingNinnekos(graphClient: GraphQLClient) {
    console.log('From block: ' + process.env.FROM_BLOCK);
    console.log('To block: ' + process.env.TO_BLOCK);

    const filterSold = {
        address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
        topics: [
            '0x7bd0b0502f39fae4cc20b3da611aa9e529ffa26435779fe6f2068f197151d9d0',
        ],
    };
    const logsSold = await provider.getLogs({
        fromBlock: process.env.FROM_BLOCK ? parseInt(process.env.FROM_BLOCK) : 'latest',
        toBlock: process.env.TO_BLOCK ? parseInt(process.env.TO_BLOCK) : 'latest',
        ...filterSold,
    });
    
    console.log(logsSold.length + ' sold ninnekos to add')

    for (const log of logsSold) {
        const tokenId = log?.topics[1];

        const timestamp = new Date(
            (await provider.getBlock(log.blockHash)).timestamp * 1000
        );

        const data = await graphClient.request(query.pet, {
            id: parseInt(tokenId, 16),
        });
        console.log(`${data.pet.id} - ${data.pet.name}`);

        await ninnekos.insertDB(
            data.pet,
            graphClient,
            parseInt(log.data, 16),
            timestamp,
            null,
            null
        );
    }

    const filterListed = {
        address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
        topics: [
            '0x187f616f90eaf716f9196a8f2eaead21fec5a107062159e6cc7e92b70ba9bca9',
        ],
    };

    const logsListed = await provider.getLogs({
        fromBlock: process.env.FROM_BLOCK ? parseInt(process.env.FROM_BLOCK) : 'latest',
        toBlock: process.env.TO_BLOCK ? parseInt(process.env.TO_BLOCK) : 'latest',
        ...filterListed,
    });
    
    console.log(logsListed.length + ' listed ninnekos to add')

    for (const log of logsListed) {
        const tokenId = log?.topics[1];

        const timestamp = new Date(
            (await provider.getBlock(log.blockHash)).timestamp * 1000
        );

        const data = await graphClient.request(query.pet, {
            id: parseInt(tokenId, 16),
        });
        console.log(`${data.pet.id} - ${data.pet.name}`);

        await ninnekos.insertDB(
            data.pet,
            graphClient,
            null,
            null,
            parseInt(log.data, 16),
            timestamp
        );
    }
}
