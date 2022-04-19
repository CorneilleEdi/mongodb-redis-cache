import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuotesRepository } from './quotes.repository';
import { QuoteNotExistError } from './exceptions/quote-not-exist.error';
import { QuoteNotFoundException } from './exceptions/quote-not-found.exception';

@Injectable()
export class QuotesService {
    constructor(private readonly quotesRepository: QuotesRepository) {}

    async create(createQuoteDto: CreateQuoteDto) {
        try {
            return await this.quotesRepository.create(createQuoteDto);
        } catch (e) {
            throw new InternalServerErrorException(e.message ?? '');
        }
    }

    async findAll() {
        return await this.quotesRepository.findAll();
    }

    async findOne(id: string) {
        try {
            return await this.quotesRepository.findOne(id);
        } catch (e) {
            if (e instanceof QuoteNotExistError) throw new QuoteNotFoundException(id);

            throw new InternalServerErrorException(e.message ?? '');
        }
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
