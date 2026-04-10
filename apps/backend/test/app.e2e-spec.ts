import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, INestMicroservice } from '@nestjs/common';
import request from 'supertest';
import { Transport } from '@nestjs/microservices';
import { BackendModule } from './../src/backend.module';
import { TickerServiceModule } from '../../ticker-service/src/ticker-service.module';

const TEST_TICKER_PORT = 44_457;

describe('BackendController (e2e)', () => {
  let app: INestApplication;
  let tickerMicroservice: INestMicroservice;

  beforeEach(async () => {
    process.env.TICKER_SERVICE_HOST = '127.0.0.1';
    process.env.TICKER_SERVICE_PORT = String(TEST_TICKER_PORT);

    const tickerFixture: TestingModule = await Test.createTestingModule({
      imports: [TickerServiceModule],
    }).compile();

    tickerMicroservice = tickerFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: TEST_TICKER_PORT },
    });
    await tickerMicroservice.listen();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BackendModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await tickerMicroservice.close();
  });

  it('GET /tickers proxies the ticker microservice', () => {
    return request(app.getHttpServer())
      .get('/tickers')
      .expect(200)
      .expect(['BTC', 'ETH', 'XRP', 'DOGE', 'SOL']);
  });
});
