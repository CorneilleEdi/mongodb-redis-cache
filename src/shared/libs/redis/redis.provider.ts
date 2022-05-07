import { RedisClient } from './redis.type';
import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CONFIGURATIONS } from '../../configuration';
import { REDIS_CLIENT } from '../../providers.constant';

export const redisProviders: Provider[] = [
  {
    provide: REDIS_CLIENT,
    useFactory: async (configService: ConfigService): Promise<RedisClient> => {
      const logger: Logger = new Logger(REDIS_CLIENT);

      const [host, port, password, db] = [
        configService.get(CONFIGURATIONS.REDIS_HOST),
        configService.get(CONFIGURATIONS.REDIS_PORT),
        configService.get(CONFIGURATIONS.REDIS_PASSWORD),
        configService.get(CONFIGURATIONS.REDIS_DATABASE),
      ];

      try {
        const client = await new Redis({
          host,
          port,
          password,
          db,
        });

        logger.verbose(`Redis database ${db}  connected`);
        return client;
      } catch (error) {
        logger.error('Redis connection error', error);
      }
    },
    inject: [ConfigService],
  },
];
