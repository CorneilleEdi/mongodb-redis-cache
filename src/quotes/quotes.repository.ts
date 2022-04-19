import { Injectable } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { InjectModel } from '@nestjs/mongoose';
import { QuoteEntity, QuoteDocument } from './schemas/quote.schema';
import { Model } from 'mongoose';
import { QuotesMapper } from './mapper/quotes.mapper';
import { Quote } from './types/quote';
import { QuoteNotExistError } from './exceptions/quote-not-exist.error';

@Injectable()
export class QuotesRepository {
    constructor(
        @InjectModel(QuoteEntity.name) private quoteModel: Model<QuoteDocument>,
        private readonly quotesMapper: QuotesMapper,
    ) {}

    async create(quote: any): Promise<Quote> {
        const q = new this.quoteModel(quote);
        const quoteDoc = await q.save();

        return this.quotesMapper.quoteDocumentToQuote(quoteDoc);
    }

    async findAll(): Promise<Quote[]> {
        const quoteDocs = await this.quoteModel.find().exec();

        return quoteDocs.map((doc) => this.quotesMapper.quoteDocumentToQuote(doc));
    }

    async findOne(id: string): Promise<Quote | null> {
        const quoteDoc = await this.quoteModel.findById(id).exec();

        if (!quoteDoc) throw new QuoteNotExistError(id);

        return this.quotesMapper.quoteDocumentToQuote(quoteDoc);
    }

    async update(id: string, quote: any): Promise<Quote | null> {
        const quoteDoc = await this.quoteModel.findByIdAndUpdate(id, quote, { new: true });

        if (!quoteDoc) throw new QuoteNotExistError(id);

        return this.quotesMapper.quoteDocumentToQuote(quoteDoc);
    }

    async remove(id: string): Promise<Quote | null> {
        const quoteDoc = await this.quoteModel.findByIdAndRemove(id);

        if (!quoteDoc) throw new QuoteNotExistError(id);

        return this.quotesMapper.quoteDocumentToQuote(quoteDoc);
    }
}
