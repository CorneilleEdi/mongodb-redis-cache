import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationModule, CONFIGURATIONS } from './shared/configuration';
import { QuotesModule } from './quotes/quotes.module';

@Module({
  imports: [
    ConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get(CONFIGURATIONS.MONGODB_HOST);
        const port = configService.get(CONFIGURATIONS.MONGODB_PORT);
        const username = configService.get(CONFIGURATIONS.MONGODB_USERNAME);
        const password = configService.get(CONFIGURATIONS.MONGODB_PASSWORD);
        let uri;
        if (username && password)
          uri = `mongodb://${username}:${password}@${host}:${port}/mongo-redis?authSource=admin`;
        else uri = `mongodb://${host}:${port}/mongo-redis`;
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    QuotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
