const helpUnsubscribe =
    "COMO COMPRAR VIP?\
\nPrimeiro, mande 20 BUSD para essa carteira:\
\n0xa24d8b3637e112489B0C956eEe2Cd8bEc826d6FF\
\n\
\nCopie a hash da transação feita (transação de 20 BUSD).\
\n\
\nDepois escreva /linkarwallet (escreva sua wallet)\
\n\
\nApós linkar sua wallet /comprarvip (escreva a hash da transação)\
\n\
\nE está pronto, seu acesso ao AlphaC está garantido.\
\n\
\n\
\nQUANTO CUSTA?\
\n20 BUSD por mês\
\n\
\nCUIDADO COM SCAM!\
\nNosso time (beside VVNeko Bot#0285) nunca irá te mandar mensagem direta.";

// \n/subscribe wallet [bep20_address]     <- Link your bep-20 wallet to your discord user\
// \n                                      (only need to do one time) \
// \n/subscribe buy [transaction_id]       <- Then you can send your transaction hash and\
// \n    
// \nHOW DOES IT WORK?\
// \nAll interactions with our features are done preferably via DM with VVNeko Bot#0285 (here).\
// \nAfter purchasing the subscription you will have access to our features and our private channel where you will receive support and exchange experiences with other users.\
// \n\                                  the bot will automatically verify your payment\
// \nANTES de enviar seus BUSDs make sure you are talking to the correct bot. To do this go to the NPS Server member list (upper right), right click on VV Bot Bot, and click on 'message'.";


const welcome =
    'Olá!\
\nBem vindo ao bot do AlphaC!\
\n\
\n' + helpUnsubscribe;

const helpCommands = {
    '/subscribe': { info: 'Information about your subscription and wallet' },
    '/search [[parts]] [breed] [life_stage]': 'Search Ninneko by genes/traits, breed count and life stage',
    '/snipe': {
        'add [name] [[parts]]':
            'Add new snipe with provided ninneko parts information (Up to 3)',
        'remove [name]': 'Remove snipe with determined name',
        info: 'Information about your snipes',
    },
    '/price_check [[parts]] [breed]': 'Search for the last 10 sold ninnekos that matches the given parameters',
    '[[parts]]': '[weapon] [weapon_h1] [weapon_h2] [eye] [eye_h1] [eye_h2] [hat] [hat_h1] [hat_h2] [tail] [tail_h1] [tail_h2]',
    '[]': 'Everything that is in brackets are variables for slash commands',
    'If you want a list of parts to use with search you can try:': '',
    '/show': { weapons: '', eyes: '', hats: '', tails: '' },
    
};

const commmandsToString = (input: any) => {
    const commands = [];
    for (const command of Object.keys(input)) {
        if (typeof input[command] !== 'string') {
            for (const subCommand of Object.keys((input as any)[command])) {
                const description = (input as any)[command][subCommand];
                commands.push(
                    `${command} ${subCommand} ${
                        description ? '<- ' + description : ''
                    }`
                );
            }
        } else {
            const description = (input as any)[command];
            commands.push(
                `${command} ${description ? '<- ' + description : ''}`
            );
        }
    }
    return commands.join('\n\n');
};

const helpSubscribed =
    'Em construção!!!\n\n' + commmandsToString(helpCommands);

export default { welcome, helpUnsubscribe, helpSubscribed };
