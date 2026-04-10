import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TickerServiceModule } from './../src/ticker-service.module';

const TEST_TCP_PORT = 44_456;

describe('TickerServiceController (e2e)', () => {
  let app: INestMicroservice;
  let client: ClientProxy;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TickerServiceModule],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: TEST_TCP_PORT },
    });
    await app.listen();

    client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: TEST_TCP_PORT },
    });
    await client.connect();
  });

  afterEach(async () => {
    await client.close();
    await app.close();
  });

  it('getAvailableTickers (TCP)', async () => {
    const tickers = await firstValueFrom(
      client.send<string[]>({ cmd: 'getAvailableTickers' }, {}),
    );
    expect(tickers).toEqual(['BTC', 'ETH', 'XRP', 'DOGE', 'SOL']);
  });
});
