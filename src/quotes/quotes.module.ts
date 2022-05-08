import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { QuotesRepository } from './quotes.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { QuoteEntity, QuoteSchema } from './schemas/quote.schema';
import { QuotesMapper } from './mapper/quotes.mapper';
import { QuotesEventsListenerService } from './quotes-events-listener.service';
import { RedisModule } from '../shared/libs/redis';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuoteEntity.name, schema: QuoteSchema, collection: 'quotes' },
    ]),
    RedisModule,
  ],
  controllers: [QuotesController],
  providers: [QuotesRepository, QuotesMapper, QuotesService, QuotesEventsListenerService],
})
export class QuotesModule {}
