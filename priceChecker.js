import { queryNinnekos } from './searchHelper.js';

export default async function priceChecker(args, graphClient) {
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

        const variables = {
            page: 0,
            lifeStage,
            limit: 9,
            forSale: 1,
            breedCount: breed,
            faction,
            class: clazz,
            handD: weapon[0],
            tailD: tail[0],
            eyesD: eye[0],
            hairD: hat[0],
            earsD: ear[0],
            mouthD: mouth[0],
            mouthR: mouth[1],
            mouthR1: mouth[2],
            sortID,
            sortPrice,
            priceSetAt,
        };

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
