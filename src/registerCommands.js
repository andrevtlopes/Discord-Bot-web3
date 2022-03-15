import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const commands =
    {
        name: 'ping',
        type: 1,
        description: 'Replies with Pong!',
    };

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        const commands = await rest.get(Routes.applicationCommands(process.env.APPLICATION_ID));
        console.log(commands)

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
