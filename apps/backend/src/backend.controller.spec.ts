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
  const mockGetAvailableTickers = jest
    .fn()
    .mockResolvedValue({ items: [mockedTicker], totalPages: 1 });

  beforeEach(async () => {
    mockGetAvailableTickers.mockClear();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BackendController],
      providers: [
        {
          provide: BackendService,
          useValue: {
            getAvailableTickers: mockGetAvailableTickers,
          },
        },
      ],
    }).compile();

    backendController = app.get<BackendController>(BackendController);
  });

  it('getAvailableTickers delegates to BackendService with limit, offset, and search', async () => {
    const result = await backendController.getAvailableTickers(12, 0, 'btc');

    expect(mockGetAvailableTickers).toHaveBeenCalledWith(12, 0, 'btc');
    expect(result.items).toHaveLength(1);
    expect(result.totalPages).toBe(1);
    expect(result.items[0].symbol).toBe('BTC');
    expect(result.items[0].history[1].price).toBe(72_000);
  });
});
