import { PrismaClient } from '@prisma/client';
import Logger from '../logger';

export class Db {
  private static instance: PrismaClient;
  private constructor() {}

  public static async getInstance(): Promise<PrismaClient> {
    if (!Db.instance) {
      Logger.info('Establishing a connection to the database');
      Db.instance = new PrismaClient();
      await Db.instance.$connect();
      Logger.info('Connected to the database');
    }
    return Db.instance;
  }

  public static async cleanup(): Promise<void> {
    Logger.info('Disconnecting from the database');
    await Db.instance?.$disconnect();
    Logger.info('Disconnected from the database');
  }
}
