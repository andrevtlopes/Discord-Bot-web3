import { CommandInteraction } from 'discord.js';
import User from '../models/user.model';


export default async function check(user: User, interaction: CommandInteraction): Promise<void> {
    try {
        await interaction.reply({ content: await checkSnipe(user), ephemeral: true });
    } catch (e: any) {
        if (e.message) {
            await interaction.reply({ content: e.message, ephemeral: true });
        } else {
            console.log(e);
        }
    }
}

const checkSnipe = async (user: User): Promise<string> => {
    const snipes = await user.getSnipes();
    if (snipes.length > 0) {
        const snipeArray = [];
        for (const snipe of snipes) {
            snipeArray.push(snipe.name);
        }
        return snipeArray.join('\n')
    }
    
    return 'No snipes to check';
}