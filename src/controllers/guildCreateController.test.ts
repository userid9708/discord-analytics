import { PrismaClient } from '@prisma/client';
import { Guild } from 'discord.js';

import { Db } from '../db';
import { onGuildCreate } from './guildCreateController';

describe('guildCreate controller', () => {
  let db: PrismaClient;
  beforeAll(async () => {
    process.env.n;
    db = await Db.getInstance();
  });

  beforeEach(async () => {
    await db.guild.deleteMany();
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await Db.cleanup();
  });

  it('adds a guild to the database when the bot joins it', async () => {
    const guild = {
      id: 'test-guild-id',
      name: 'Test Guild',
      fetchOwner: jest.fn().mockResolvedValue({
        user: {
          id: 'test-owner-id',
        },
      }),
    } as unknown as Guild;
    await onGuildCreate(guild);
    const fetchedGuild = await db.guild.findFirst();
    const fetchedOwner = await db.user.findFirst({
      where: { id: fetchedGuild?.ownerId },
    });

    expect(fetchedGuild).toEqual({
      id: expect.any(String),
      discordId: 'test-guild-id',
      name: 'Test Guild',
      ownerId: expect.any(String),
    });
    expect(fetchedOwner).toEqual({
      id: expect.any(String),
      discordId: 'test-owner-id',
    });
  });
});
