import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuotesRepository } from './quotes.repository';
import { QuoteNotExistError } from './exceptions/quote-not-exist.error';
import { QuoteNotFoundException } from './exceptions/quote-not-found.exception';
import { RedisRepository } from '../shared/libs/redis';
import { Quote } from './types/quote';

@Injectable()
export class QuotesService {
  logger: Logger = new Logger();

  constructor(
    private readonly quotesRepository: QuotesRepository,
    private readonly redisRepository: RedisRepository<Quote>,
  ) {
    redisRepository.setPrefix('mongoCache');
  }

  async create(createQuoteDto: CreateQuoteDto) {
    try {
      return await this.quotesRepository.create(createQuoteDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message ?? '');
    }
  }

  async findAll() {
    let quotes: Quote[] = [];
    try {
      quotes = await this.redisRepository.findAll();
    } catch (e) {
      this.logger.error('find all quotes error', e);
      quotes = await this.quotesRepository.findAll();
    }
    return quotes;
  }

  async findOne(id: string) {
    let quote: Quote;

    try {
      quote = await this.redisRepository.get(id);
      if (!quote) quote = await this.quotesRepository.findOne(id);
    } catch (e) {
      if (e instanceof QuoteNotExistError) throw new QuoteNotFoundException(id);

      throw new InternalServerErrorException(e.message ?? '');
    }

    return quote;
  }

  async update(id: string, updateQuoteDto: UpdateQuoteDto) {
    try {
      return await this.quotesRepository.update(id, updateQuoteDto);
    } catch (e) {
      if (e instanceof QuoteNotExistError) throw new QuoteNotFoundException(id);

      throw new InternalServerErrorException(e.message ?? '');
    }
  }

  async remove(id: string) {
    try {
      return await this.quotesRepository.remove(id);
    } catch (e) {
      if (e instanceof QuoteNotExistError) throw new QuoteNotFoundException(id);

      throw new InternalServerErrorException(e.message ?? '');
    }
  }
}
