import { Client, Intents, Message } from 'discord.js';
import dotenv from 'dotenv';
import Logger from './logger';

(async () => {
  dotenv.config();

  Logger.info('Starting bot...');

  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  client.once('ready', () => {
    Logger.info('Client ready!');
  });

  client.on('messageCreate', async (message: Message) => {
    Logger.info(`Message received: ${JSON.stringify(message)}`);
  });

  client.login(process.env.TOKEN);
})();
