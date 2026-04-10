import { Test, TestingModule } from '@nestjs/testing';
import { BackendController } from './backend.controller';
import { BackendService } from './backend.service';
import type { ITickerAsset } from '@shared/common/types/ticker';

const mockedTicker: ITickerAsset = {
  symbol: 'BTC',
  name: 'Bitcoin',
  logo: 'https://example.com/btc.png',
  marketCap: 1_000_000_000_000,
  volume: 40_000_000_000,
  supply: 20_000_000,
  price: 70_000,
  history: [
    { timestamp: 1700000000000, price: 70_000 },
    { timestamp: 1700086400000, price: 72_000 },
  ],
};

describe('BackendController', () => {
  let backendController: BackendController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BackendController],
      providers: [
        {
          provide: BackendService,
          useValue: {
            getAvailableTickers: () => [mockedTicker],
          },
        },
      ],
    }).compile();

    backendController = app.get<BackendController>(BackendController);
  });

  it('getAvailableTickers delegates to BackendService', async () => {
    const result = await backendController.getAvailableTickers();

    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe('BTC');
    expect(result[0].history[1].price).toBe(72_000);
  });
});
