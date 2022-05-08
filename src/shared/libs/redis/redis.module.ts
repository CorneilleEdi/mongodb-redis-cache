import { redisProviders } from './redis.provider';
import { RedisService } from './redis.service';
import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigurationModule } from '../../configuration';
import { RedisRepository } from './redis.repository';

@Module({
  providers: [...redisProviders, RedisService, RedisRepository],
  exports: [...redisProviders, RedisService, RedisRepository],
  imports: [ConfigurationModule],
})
export class RedisModule implements OnApplicationShutdown {
  logger = new Logger(RedisModule.name);

  constructor(private redisService: RedisService) {}

  async onApplicationShutdown() {
    try {
      this.redisService.closeConnection();
      this.logger.debug('All redis databases disconnected');
    } catch (error) {
      this.logger.error('Closing all redis connection error', error);
    }
  }
}
