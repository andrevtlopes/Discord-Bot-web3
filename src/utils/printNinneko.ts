import { MessageEmbed } from 'discord.js';
import { partArray, partTypes } from '../parts';
import { byId, getLifeStage, getPartName } from '../searchHelper';
import { factions } from './types';

export default function printNinneko(
    pet: any,
    price: string,
    listedAt: Date | null = null
): MessageEmbed {
    const fields = partArray.map((part, idx) => ({
        name: byId(partTypes, idx + 1)?.toUpperCase(),
        value: `${getPartName(pet[part + 'D'])}\n${getPartName(
            pet[part + 'R']
        )}\n${getPartName(pet[part + 'R1'])}`,
        inline: true,
    }));

    const lifeStage = getLifeStage(pet.createdAt);
    // @ts-ignore
    const color = factions[pet.faction].color;

    const embeded = new MessageEmbed()
        .setColor(color) // 00ab55
        .setTitle(`${pet.id} - ${pet.name}`)
        .setURL(`https://market.ninneko.com/pet/${pet.id}`)
        // .setDescription('Some description here')
        .setThumbnail(pet.avatarURL)
        .addFields(
            {
                name: 'Faction',
                // @ts-ignore
                value: factions[pet.faction].name,
                inline: true,
            },
            {
                name: 'Price',
                value: price + ' BNB',
                inline: true,
            },
            {
                name: lifeStage === 'Adult' ? 'Breeds' : 'New Born',
                value:
                    lifeStage === 'Adult' ? `${pet.breedCount}/6\n` : lifeStage,
                inline: true,
            }
        )
        .addFields(fields);

    if (listedAt) {
        embeded.setTimestamp(listedAt).setFooter({ text: 'Listed' });
    }

    return embeded;
}
