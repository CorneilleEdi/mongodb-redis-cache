import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuoteDocument = QuoteEntity & Document;

@Schema()
export class QuoteEntity {
  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  content: string;
}

export const QuoteSchema = SchemaFactory.createForClass(QuoteEntity);
