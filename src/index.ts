import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';

import Logger from './logger';
import './db';
import { Db } from './db';
import { pick } from 'lodash';

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

  client.on('guildCreate', async (guild) => {
    try {
      Logger.info('Joined guild', pick(guild, ['id', 'name']));
      const db = await Db.getInstance();
      const owner = await guild.fetchOwner();
      await db.guild.create({
        data: {
          discordId: guild.id,
          name: guild.name,
          owner: {
            connectOrCreate: {
              where: {
                discordId: owner.user.id,
              },
              create: {
                discordId: owner.user.id,
              },
            },
          },
        },
      });
    } catch (error) {
      Logger.error('Error joining guild', error);
    }
  });

  client.login(process.env.TOKEN);
})();
