import { redisProviders } from './redis.provider';
import { RedisService } from './redis.service';
import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigurationModule } from '../../configuration';

@Module({
  providers: [...redisProviders, RedisService],
  exports: [...redisProviders, RedisService],
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
