import { parentPort, workerData } from 'worker_threads';
import { client } from '../src/index';

(async () => {
    const { discordID, username } = workerData;

    let guild = client.guilds.cache.get('951929724442132520');
    if (!guild) {
      guild = await client.guilds.fetch('951929724442132520');
    }
    let role = guild?.roles.cache.find((r: any) => r.name === 'Subscribed');
    if (!role) {
      role = (await guild.roles.fetch()).find((r: any) => r.name === 'Subscribed');
    }
    let member = guild?.members.cache.find(member => member.id === discordID);
    if (!member) {
      member = await guild.members.fetch(discordID);
    }
    await (member.roles)?.remove(role as any);
    console.info(`[${username}] Role ended`);

  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();