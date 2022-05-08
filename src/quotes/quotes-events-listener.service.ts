import { Injectable, Logger } from '@nestjs/common';
import { QuotesRepository } from './quotes.repository';
import { RedisRepository } from '../shared/libs/redis';
import { Quote } from './types/quote';
import { ChangeStream, UpdateDescription } from 'mongodb';
import { QuoteDocument } from './schemas/quote.schema';
import { QuotesMapper } from './mapper/quotes.mapper';

@Injectable()
export class QuotesEventsListenerService {
  logger: Logger = new Logger();
  private readonly changeStream: ChangeStream;

  constructor(
    private readonly quotesRepository: QuotesRepository,
    private readonly redisRepository: RedisRepository<Quote>,
    private readonly quotesMapper: QuotesMapper,
  ) {
    redisRepository.setPrefix('mongoCache');
    this.changeStream = quotesRepository.getModel().collection.watch();

    this.changeStream.on('change', async (event) => {
      const documentId = event.documentKey._id.toString();

      switch (event.operationType) {
        case 'insert':
          await this.onDocumentInserted(documentId, event.fullDocument);
          break;

        case 'update':
          await this.onDocumentUpdated(documentId, event.updateDescription);
          break;

        case 'delete':
          await this.onDocumentDeleted(documentId);
          break;
        default:
          this.logger.warn('Event listener operation not supported');
      }
    });
  }

  async onDocumentInserted(documentId: string, document: any) {
    const doc = this.quotesMapper.quoteDocumentToQuote(document);

    try {
      await this.redisRepository.add(doc);
    } catch (e) {
      this.logger.error('Cache insertion error', e);
    }
  }

  async onDocumentUpdated(documentId: string, updatedDocument: UpdateDescription<QuoteDocument>) {
    try {
      const oldDocument = await this.redisRepository.get(documentId);

      if (!oldDocument) throw new Error('Document not found');

      const quote: Quote = {
        ...oldDocument,
        ...updatedDocument.updatedFields,
      };
      await this.redisRepository.update(quote);
    } catch (e) {
      this.logger.error('Cache update error', e);
    }
  }

  async onDocumentDeleted(documentId: string) {
    try {
      await this.redisRepository.delete(documentId);
    } catch (e) {
      this.logger.error('Cache deletion error', e);
    }
  }
}
