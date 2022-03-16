export const factions = {
    1: {
        id: 1,
        name: 'Thunder',
        imageURL: 'https://market.ninneko.com/images/svg/h5.svg',
        color: '#F8CE46',
    },
    2: {
        id: 2,
        name: 'Fire',
        imageURL: 'https://market.ninneko.com/images/svg/h1.svg',
        color: '#DB453C',
    },
    3: {
        id: 3,
        name: 'Earth',
        imageURL: 'https://market.ninneko.com/images/svg/h3.svg',
        color: '#C77842',
    },
    4: {
        id: 4,
        name: 'Wind',
        imageURL: 'https://market.ninneko.com/images/svg/h2.svg',
        color: '#56AE44',
    },
    5: {
        id: 5,
        name: 'Water',
        imageURL: 'https://market.ninneko.com/images/svg/h4.svg',
        color: '#5CCAF2',
    },
    6: {
        id: 6,
        name: 'YinYang',
        imageURL: 'https://market.ninneko.com/images/svg/h6.svg',
        color: '#9233CE',
    },
};

export const partialParts = [
    { name: 'handD', discordName: 'weapon', partId: 4 },
    { name: 'handR', discordName: 'weaponh1', partId: 4 },
    { name: 'handR1', discordName: 'weaponh2', partId: 4 },
    { name: 'eyesD', discordName: 'eye', partId: 1 },
    { name: 'eyesR', discordName: 'eyeh1', partId: 1 },
    { name: 'eyesR1', discordName: 'eyeh2', partId: 1 },
    { name: 'hairD', discordName: 'hat', partId: 3 },
    { name: 'hairR', discordName: 'hat1', partId: 3 },
    { name: 'hairR1', discordName: 'hat2', partId: 3 },
    { name: 'tailD', discordName: 'tail', partId: 6 },
    { name: 'tailR', discordName: 'tailh1', partId: 6 },
    { name: 'tailR1', discordName: 'tailh2', partId: 6 },
];

export const fullParts = [
    ...partialParts,
]
