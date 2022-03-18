import query from './query.js';
import {
    factions,
    types,
    classes,
    partTypes,
    parts,
    lifeStages,
} from './parts.js';
import { utils } from 'ethers';
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';
import { generate } from 'csv-generate';

export default async function createWeaponTable(graphClient) {
    const weapons = Object.values(parts).filter(
        (part) => part.part === partTypes['weapon']
    );

    const records = [
        ['Name', 'New Born', 'New Born 4d', 'New Born 5d', 'Adult'],
    ];

    for (const weapon of weapons) {
        const variables = {
            page: 0,
            forSale: 1,
            breedCount: [0],
            handD: [weapon.id],
            // handD: [18], // Angel for testing
            sortPrice: false,
        };

        let newBorns = await graphClient.request(query, {
            ...variables,
            lifeStage: 1,
            limit: 100,
        });
        let adults = await graphClient.request(query, {
            ...variables,
            lifeStage: 2,
            limit: 1,
        });
        newBorns = newBorns.pets;
        adults = adults.pets;
        // console.log(adults);

        const nb4d = newBorns.find((nb) => getDays(nb.createdAt) >= 4 && getDays(nb.createdAt) < 5);
        const nb5d = newBorns.find((nb) => getDays(nb.createdAt) >= 5);

        records.push([
            weapon.name,
            newBorns[0] && utils.formatEther(newBorns[0].price),
            nb4d && utils.formatEther(nb4d.price),
            nb5d && utils.formatEther(nb5d.price),
            adults[0] && utils.formatEther(adults[0].price),
        ]);
    }

    console.log(records.map((e) => e.join(',')).join('\n'));
}

export function getDays(createdAt) {
    const createdDate = new Date(createdAt);
    // get total seconds between the times
    let delta = Math.abs(Date.now() - createdDate) / 1000;
    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);

    return days;
}
