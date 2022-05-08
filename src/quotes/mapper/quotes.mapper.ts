import { Injectable } from '@nestjs/common';
import { QuoteDocument } from '../schemas/quote.schema';
import { Quote } from '../types/quote';

@Injectable()
export class QuotesMapper {
  quoteDocumentToQuote(quoteDocument: QuoteDocument): Quote {
    return {
      id: quoteDocument._id?.toString() ?? quoteDocument.id,
      author: quoteDocument.author,
      content: quoteDocument.content,
    };
  }
}
