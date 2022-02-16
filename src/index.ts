import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';

import Logger from './logger';
import './db';
import { onGuildCreate } from './controllers/guildCreateController';

(async () => {
  dotenv.config();

  Logger.info('Starting bot...');

  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  client.once('ready', () => {
    Logger.info('Client ready!');
  });

  client.on('messageCreate', async (message) => {
    Logger.info(`Message received: ${JSON.stringify(message)}`);
  });

  client.on('guildCreate', onGuildCreate);

  client.login(process.env.TOKEN);
})();
