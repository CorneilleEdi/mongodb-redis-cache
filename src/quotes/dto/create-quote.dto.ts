import { IsString, MinLength } from 'class-validator';

export class CreateQuoteDto {
    @IsString()
    @MinLength(4)
    author: string;

    @IsString()
    @MinLength(4)
    content: string;
}
