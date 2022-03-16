import {
    factions,
    classes,
    lifeStages,
} from './parts.js';
import { queryNinnekos } from './searchHelper.js';

export default async function search(args, graphClient) {
    try {
        const searchArgs = args
            .shift()
            .toLowerCase()
            .split(':')
            .map((args) => (args === '' ? null : args));

        const faction = getItemsNumber(searchArgs.shift(), factions);
        const clazz = getItemsNumber(searchArgs.shift(), classes);
        let breed = searchArgs.shift();
        const lifeStage = getItemsNumber(searchArgs.shift(), lifeStages, false);
        const partArgs = searchArgs
            .shift()
            .split(',')
            .map((args) => (args === '' ? null : args));

        const sort = searchArgs.shift();
      
        return await queryNinnekos({
            faction,
            clazz,
            breed,
            lifeStage,
            parts: partArgs,
            sort,
        }, graphClient);
        
    } catch (e) {
        if (e.message) return e.message;
        // message.reply(`${e.message}`);
        console.log(e);
    }
}

