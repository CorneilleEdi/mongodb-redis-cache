import { NotFoundException } from '@nestjs/common';

export class QuoteNotFoundException extends NotFoundException {
  constructor(key?: string) {
    super(`Quote ${key} not found`);
  }
}
