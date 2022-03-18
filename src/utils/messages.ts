const helpUnsubscribe =
    "HOW TO SUBSCRIBE?\
\nFirst, send 20 BUSD to this wallet:\
\n0xa24d8b3637e112489B0C956eEe2Cd8bEc826d6FF\
\n\
\nSecond, copy the transaction hash from the 20 BUSD transaction.\
\n\
\nThird, type /subscribe wallet (insert here your wallet)\
\n\
\nFourth, type /subscribe buy (insert here the transaction hash)\
\n\
\nAnd its done, your acess is granted to the bot.\
\n\
\n/subscribe wallet [bep20_address]     <- Link your bep-20 wallet to your discord user\
\n                                      (only need to do one time) \
\n/subscribe buy [transaction_id]       <- Then you can send your transaction hash and\
\n                                      the bot will automatically verify your payment\
\n\
\nHOW DOES IT WORK?\
\nAll interactions with our features are done preferably via DM with Ninneko Power Search#0285 (here).\
\nAfter purchasing the subscription you will have access to our features and our private channel where you will receive support and exchange experiences with other users.\
\n\
\nHOW MUCH DOES IT COST?\
\n20 BUSD per week\
\n\
\nBE AWARE OF SCAMMERS!\
\nOur team (beside Ninneko Power Search#0285) will NEVER direct message you.\
\nBEFORE sending your BUSDs make sure you are talking to the correct bot. To do this go to the NPS Server member list (upper right), right click on Ninneko Power Search Bot, and click on 'message'.";

const welcome =
    'Hi!\
\nWelcome to Ninneko Power Search!\
\n\
\n' + helpUnsubscribe;

const helpCommands = {
    '/subscribe': { info: 'Information about your subscription and wallet' },
    '/search [[parts]] [breed] [life_stage]': 'Search Ninneko by H1 and H2',
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
    'In construction!!!\n\n' + commmandsToString(helpCommands);

export default { welcome, helpUnsubscribe, helpSubscribed };
