import { RedisClient } from './redis.type';
import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from '../../providers.constant';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClient,
  ) {}

  closeConnection() {
    return this.redisClient.disconnect();
  }

  getRedis(): RedisClient {
    return this.redisClient;
  }
}
