import query from './query.js';
import {
    factions,
    types,
    classes,
    partTypes,
    parts,
    lifeStages,
    partArray,
} from './parts.js';
import { utils } from 'ethers';
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';

export const  queryNinnekos = async ({
    faction = null,
    clazz = null,
    breed = null,
    lifeStage = null,
    parts,
    sort = null,
}, graphClient) => {
    if (!breed) {
        breed = [0, 1, 2, 3, 4, 5, 6];
    } else {
        breed = [parseInt(breed)];
    }

    const weapon = getPartsNumber(parts.shift(), partTypes.weapon);
    const tail = getPartsNumber(parts.shift(), partTypes.tail);
    const eye = getPartsNumber(parts.shift(), partTypes.eye);
    const hat = getPartsNumber(parts.shift(), partTypes.hat);
    const ear = getPartsNumber(parts.shift(), partTypes.ear);
    const mouth = getPartsNumber(parts.shift(), partTypes.mouth);

    let sortPrice = null;
    let priceSetAt = true;
    let sortID = null;

    if (sort === 'price') {
        sortPrice = false;
        priceSetAt = null;
        sortID = null;
    }

    const variables = {
        page: 0,
        lifeStage,
        limit: 1000,
        forSale: 1,
        breedCount: breed,
        faction,
        class: clazz,
        handD: weapon[0],
        handR: weapon[1],
        handR1: weapon[2],
        tailD: tail[0],
        tailR: tail[1],
        tailR1: tail[2],
        eyesD: eye[0],
        eyesR: eye[1],
        eyesR1: eye[2],
        hairD: hat[0],
        hairR: hat[1],
        hairR1: hat[2],
        earsD: ear[0],
        earsR: ear[1],
        earsR1: ear[2],
        mouthD: mouth[0],
        mouthR: mouth[1],
        mouthR1: mouth[2],
        sortID,
        sortPrice,
        priceSetAt,
    };

    const data = await graphClient.request(query, variables);
    // console.log(JSON.stringify(data, undefined, 2));

    const table = new AsciiTable3()
        .setHeading('BNB', 'FACTION', 'ID', 'B', 'Age', 'H1H2 Weapon', 'H1H2')
        .setAlign(3, AlignmentEnum.RIGHT)
        .addRowMatrix(
            data.pets
                .map((pet) => [
                    parseFloat(utils.formatEther(pet.price.toString())).toFixed(
                        2
                    ),
                    byId(factions, pet.faction),
                    pet.id,
                    pet.breedCount,
                    getLifeStage(pet.createdAt),
                    getR1R2(pet),
                    // getR1R2Prob(pet, 'hand') + '%',
                    getPetR1R2Prob(pet) + '%',
                ])
                .slice(0, 25)
        );

    table.setStyle('compact');

    return `\`\`\`${table.toString()}\`\`\``;
};

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
    const createdDate = new Date(createdAt);
    // get total seconds between the times
    let delta = Math.abs(Date.now() - createdDate) / 1000;

    // calculate (and subtract) whole days
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    let ret = `${hours}h`;

    if (days > 6) {
        return 'Adult';
    } else if (days > 0) {
        ret = `${days}d ${ret}`;
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
    return partName ? `${partName}` : '\u2B1C';
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

export function getPartNumber(part) {
    return Object.keys(parts).find(
        (key) =>
            parts[key].name.toLowerCase() === part?.toLowerCase()
    ) ?? null;
}