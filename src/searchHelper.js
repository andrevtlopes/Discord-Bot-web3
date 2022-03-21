import query from './query.js';
import {
    factions,
    parts,
    partArray,
} from './parts.js';
import { utils } from 'ethers';
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';
import WrongItemError from './WrongItemError';
import moment from 'moment';

export const  queryNinnekos = async ({
    faction = null,
    clazz = null,
    breed = null,
    lifeStage = null,
    parts,
    sort = null,
}, graphClient) => {
    if (breed === null || breed < 0 || breed > 6) {
        breed = [0, 1, 2, 3, 4, 5, 6];
    } else {
        breed = [breed];
    }

    let sortPrice = null;
    let priceSetAt = true;
    let sortID = null;

    if (sort === 'price') {
        sortPrice = false;
        priceSetAt = null;
        sortID = null;
    }

    let lifeStageId = null;
    if (lifeStage?.toLowerCase() === 'new born') {
        lifeStageId = 1;
    } else if (lifeStage?.toLowerCase() === 'adult') {
        lifeStageId = 2;
    }

    let factionId = faction ? [factions[faction?.toLowerCase()]] : null;

    const variables = {
        page: 0,
        lifeStage: lifeStageId,
        limit: 1000,
        forSale: 1,
        breedCount: breed,
        faction: factionId,
        class: clazz,
        ...parts,
        sortID,
        sortPrice,
        priceSetAt,
    };

    const data = await graphClient.request(query, variables);

    return data.pets;
};

export function getNinnekoTable(pets) {
    const table = new AsciiTable3()
        .setHeading('BNB', 'FACTION', 'ID', 'B', 'Age', 'H1H2 Weapon', 'HAT|TAIL|EYE')
        .setAlign(3, AlignmentEnum.RIGHT)
        .addRowMatrix(
            pets
                .map((pet) => [
                    parseFloat(utils.formatEther(pet.price.toString())).toFixed(
                        2
                    ),
                    byId(factions, pet.faction),
                    pet.id,
                    pet.breedCount,
                    getLifeStage(pet.createdAt),
                    getR1R2(pet),
                    `${getPartName(pet.hairD)?.substring(0, 4)}|${getPartName(pet.tailD)?.substring(0, 4)}|${getPartName(pet.eyesD)?.substring(0, 4)}`,
                ])
                .slice(0, 25)
        );

    table.setStyle('none');

    return table;
}

export function getItemsNumber(item, items, isList = true) {
    let ret = null;
    if (item) {
        ret = items?.[item] || -1;
        if (ret === -1) throw new WrongItemError(item);
        if (isList) ret = [ret];
    }
    return ret;
}

export function byId(obj, id) {
    return Object.keys(obj)[Object.values(obj).indexOf(id)];
}

export function getLifeStage(createdAt) {
    const createdDate = moment(createdAt);
    // get total seconds between the times
    const diffInDays = Math.abs(moment().diff(createdDate, 'days'));
    const diffInHours = Math.abs(moment().diff(createdDate, 'hours') - diffInDays * 24);

    let ret = `${diffInHours}h`;

    if (diffInDays >= 6) {
        return 'Adult';
    } else if (diffInDays > 0) {
        ret = `${diffInDays}d ${ret}`;
    }

    return ret;
}

export function getR1R2Prob({ partD, partR, partR1 }) {
    let prob = 72;
    partD === partR ? (prob += 20) : (prob += 6);
    partD === partR1 ? (prob += 8) : (prob += 2);
    return prob;
}

export function getR1R2(pet, part='hand') {
    return `${getPartName(pet[part + 'R'])?.substring(0, 4)}|${getPartName(pet[part + 'R1'])?.substring(0, 4)}`;
}

export function getPartName(partID) {
    const partName = parts?.[partID]?.name;
    return partName ? `${partName}` : '\u25AB';
}

export function getPetR1R2Prob(pet) {
    let prob = 0;
    for (const part of partArray) {
        prob += getR1R2Prob({
            partD: pet[part + 'D'],
            partR: pet[part + 'R'],
            partR1: pet[part + 'R1'],
        });
    }
    return (prob / partArray.length).toFixed(1);
}

export function getPartsNumber(part, partType) {
    let rets = [null, null, null];
    if (part) {
        const r = part.split('/').map((args) => (args === '' ? null : args));
        if (r) {
            rets[0] =
                [
                    Object.keys(parts).find(
                        (key) => parts[key].name.toLowerCase() === r[0]
                    ),
                ] ?? -1;
            if (r.length > 1) {
                rets[1] =
                    r[1] === null
                        ? null
                        : [
                              Object.keys(parts).find(
                                  (key) =>
                                      parts[key].name.toLowerCase() === r[1]
                              ),
                          ] ?? -1;
            }
            if (r.length > 2) {
                rets[2] =
                    r[2] === null
                        ? null
                        : [
                              Object.keys(parts).find(
                                  (key) =>
                                      parts[key].name.toLowerCase() === r[2]
                              ),
                          ] ?? -1;
            }
            if (r.length === 3 && !r[1] && !r[2]) {
                rets[1] = rets[0];
                rets[2] = rets[0];
            } else if (r.length === 3 && !r[2]) {
                const p =
                    [
                        Object.keys(parts).find(
                            (key) => parts[key].name.toLowerCase() === r[1]
                        ),
                    ] ?? -1;
                rets[1] = p;
                rets[2] = p;
            }
            for (const ret of rets) {
                if (ret) {
                    if (ret[0] === -1) throw new WrongItemError(part);
                    if (partType !== parts[ret[0]].part)
                        throw new WrongItemError(part);
                }
            }
        }
    }
    return rets;
}

export function getPartNumber(part, partId) {
    if (part !== null) {
        const id =  Object.keys(parts).find(
            (key) => parts[key].name?.toLowerCase() === part?.toLowerCase()
        );
        if (!id || partId !== parts[id].part) {
            throw new WrongItemError(part);
        }
        return id;
    } else {
        return null;
    }
}