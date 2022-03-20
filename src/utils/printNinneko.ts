import { Interaction, MessageEmbed } from 'discord.js';
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

    const embeded = new MessageEmbed();

    if (listedAt) {
        const createdDate = new Date(listedAt);
        // get total seconds between the times
        let delta = Math.abs(new Date().getTime() - createdDate.getTime()) / 1000;
    
        // calculate (and subtract) whole days
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;
    
        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
    
        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        
        embeded.setFooter({ text: 'Listed at' }).setTimestamp(listedAt).setDescription(`${days}d ${hours}:${minutes}h on the marketplace`);
    }

    embeded
        .setColor(color) // 00ab55
        .setTitle(`${pet.id}${pet.name ? ' - ' + pet.name : ''}`)
        .setURL(`https://market.ninneko.com/pet/${pet.id}`)
        // .setDescription('Some description here')
        .setThumbnail(`https://assets.ninneko.com/avatars/${pet.id}.png`)
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

    return embeded;
}
