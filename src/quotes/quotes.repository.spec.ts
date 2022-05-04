import { Test, TestingModule } from '@nestjs/testing';
import { QuotesRepository } from './quotes.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { QuoteEntity, QuoteSchema } from './schemas/quote.schema';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { QuotesMapper } from './mapper/quotes.mapper';
import { faker } from '@faker-js/faker';

describe('QuotesRepository', () => {
  let repository: QuotesRepository;
  let module: TestingModule;
  let container: StartedTestContainer;

  const MONGODB_PASSWORD = 'f2gBUp8ofdVwga1NTNunbXm6X30k13';
  const MONGODB_USERNAME = 'sonic';
  const MONGODB_PORT = 27017;

  beforeAll(async () => {
    container = await new GenericContainer('mongo:5.0')
      .withExposedPorts(MONGODB_PORT)
      .withEnv('MONGO_INITDB_ROOT_USERNAME', MONGODB_USERNAME)
      .withEnv('MONGO_INITDB_ROOT_PASSWORD', MONGODB_PASSWORD)
      .start();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            const host = container.getHost();
            const port = container.getMappedPort(MONGODB_PORT);
            return {
              uri: `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${host}:${port}`,
            };
          },
        }),
        MongooseModule.forFeature([
          { name: QuoteEntity.name, schema: QuoteSchema, collection: 'quotes' },
        ]),
      ],
      providers: [QuotesMapper, QuotesRepository],
    }).compile();

    repository = module.get<QuotesRepository>(QuotesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('findAll to return empty array', async () => {
    const quotes = await repository.findAll();
    expect(quotes).toEqual([]);
  });

  it('insert should return inserted quote', async () => {
    const quoteToInsert = {
      content: faker.lorem.sentence(),
      author: faker.name.findName(),
    };
    const insertedQuote = await repository.create(quoteToInsert);

    expect(insertedQuote.id).toBeDefined();
    expect(insertedQuote.content).toEqual(quoteToInsert.content);
    expect(insertedQuote.author).toEqual(quoteToInsert.author);
  });

  afterAll(async () => {
    await module.close();
    if (container) {
      await container.stop();
    }
  });
});
