import { queryNinnekos } from './searchHelper.js';

export default async function simpleSearch(args, graphClient) {
    try {
        const searchArgs = args
            .shift()
            .toLowerCase()
            .split(':')
            .map((args) => (args === '' ? null : args));

        const breed = searchArgs.shift();

        const partArgs = searchArgs
            .shift()
            .split(',')
            .map((args) => (args === '' ? null : args));

        return await queryNinnekos({
            breed,
            parts: partArgs,
            sort: 'price',
        }, graphClient);
    } catch (e) {
        if (e.message) return e.message;
        // message.reply(`${e.message}`);
        console.log(e);
    }
}
