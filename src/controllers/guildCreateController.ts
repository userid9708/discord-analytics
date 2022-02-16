import { Guild } from 'discord.js';
import { pick } from 'lodash';

import { Db } from '../db';
import Logger from '../logger';

export const onGuildCreate = async (guild: Guild) => {
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
};
