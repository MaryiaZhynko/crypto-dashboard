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

  describe('root', () => {
    it('should return [BTC, ETH, XRP, DOGE, SOL]', () => {
      expect(tickerServiceController.getAvailableTickers()).toBe([
        'BTC',
        'ETH',
        'XRP',
        'DOGE',
        'SOL',
      ]);
    });
  });
});
