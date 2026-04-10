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
      const tickers = tickerServiceController.getAvailableTickers();

      expect(tickers).toHaveLength(100);

      expect(tickers[0].symbol).toBe('BTC');
      expect(tickers[0].name).toBe('Bitcoin');
      expect(tickers[0].logo).toMatch(/^https:\/\//);
      expect(tickers[0].marketCap).toBeGreaterThan(0);
      expect(tickers[0].volume).toBeGreaterThanOrEqual(0);
      expect(tickers[0].supply).toBeGreaterThan(0);
      expect(tickers[0].history).toHaveLength(90);
    });
  });
});
