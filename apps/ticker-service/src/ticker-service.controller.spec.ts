import { Test, TestingModule } from '@nestjs/testing';
import { TickerServiceController } from './ticker-service.controller';
import { TickerServiceService } from './ticker-service.service';

describe('TickerServiceController', () => {
  let tickerServiceController: TickerServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TickerServiceController],
      providers: [TickerServiceService],
    }).compile();

    tickerServiceController = app.get<TickerServiceController>(
      TickerServiceController,
    );
  });

  describe('getAvailableTickers', () => {
    it('should return 100 tickers with metadata and daily history', () => {
      const { items, totalPages } = tickerServiceController.getAvailableTickers(
        {
          limit: 100,
          offset: 0,
        },
      );

      expect(items).toHaveLength(100);
      expect(totalPages).toBe(1);

      expect(items[0].symbol).toBe('btc');
      expect(items[0].name).toBe('Bitcoin');
      expect(items[0].logo).toMatch(/^https:\/\//);
      expect(items[0].marketCap).toBeGreaterThan(0);
      expect(items[0].volume).toBeGreaterThanOrEqual(0);
      expect(items[0].supply).toBeGreaterThan(0);
      expect(items[0].history).toHaveLength(7);
    });

    it('defaults to limit 12 and offset 0', () => {
      const { items, totalPages } = tickerServiceController.getAvailableTickers(
        {},
      );

      expect(items).toHaveLength(12);
      expect(totalPages).toBe(9);
    });
  });
});
