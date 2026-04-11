import { NotFoundException } from '@nestjs/common';
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
      expect(items[0].history).toHaveLength(50);
    });

    it('defaults to limit 12 and offset 0', () => {
      const { items, totalPages } = tickerServiceController.getAvailableTickers(
        {},
      );

      expect(items).toHaveLength(12);
      expect(totalPages).toBe(9);
    });

    it('filters by search on symbol or name', () => {
      const { items, totalPages } = tickerServiceController.getAvailableTickers(
        {
          limit: 100,
          offset: 0,
          search: 'bit',
        },
      );

      expect(
        items.every(
          (ticker) => /bit/i.test(ticker.symbol) || /bit/i.test(ticker.name),
        ),
      ).toBe(true);
      expect(items.length).toBeGreaterThan(0);
      expect(totalPages).toBe(1);
    });

    it('should apply offset for pagination', () => {
      const firstPage = tickerServiceController.getAvailableTickers({
        limit: 5,
        offset: 0,
      });
      const secondPage = tickerServiceController.getAvailableTickers({
        limit: 5,
        offset: 5,
      });

      expect(firstPage.items[0].symbol).not.toBe(secondPage.items[0].symbol);
      expect(firstPage.totalPages).toBe(20);
    });

    it('should treat whitespace-only search as no filter', () => {
      const withSpaces = tickerServiceController.getAvailableTickers({
        limit: 12,
        offset: 0,
        search: '   ',
      });
      const baseline = tickerServiceController.getAvailableTickers({
        limit: 12,
        offset: 0,
      });

      expect(withSpaces.items.map((ticker) => ticker.symbol)).toEqual(
        baseline.items.map((ticker) => ticker.symbol),
      );
    });
  });

  describe('getTicker', () => {
    it('should return a ticker for a matching symbol (case-insensitive)', () => {
      const upper = tickerServiceController.getTicker({ symbol: 'BTC' });
      const lower = tickerServiceController.getTicker({ symbol: 'btc' });

      expect(upper.symbol).toBe('btc');
      expect(lower.symbol).toBe('btc');
      expect(upper.name).toBe(lower.name);
    });

    it('should throw NotFoundException when the symbol is unknown', () => {
      expect(() =>
        tickerServiceController.getTicker({ symbol: 'some-weird-token-name' }),
      ).toThrow(NotFoundException);
    });
  });

  describe('getTickerPriceHistory', () => {
    it('should return five-second price points for a known symbol', () => {
      const history = tickerServiceController.getTickerPriceHistory({
        symbol: 'btc',
      });

      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThan(0);

      const first = history[0];

      expect(typeof first.timestamp).toBe('number');
      expect(typeof first.price).toBe('number');
    });

    it('should propagate NotFoundException for an unknown symbol', () => {
      expect(() =>
        tickerServiceController.getTickerPriceHistory({
          symbol: 'unknown-symbol',
        }),
      ).toThrow(NotFoundException);
    });
  });

  describe('peekLiveTickerForStream', () => {
    it('should return ticker-shaped data with live history points', () => {
      const live = tickerServiceController.peekLiveTickerForStream({
        symbol: 'btc',
      });

      expect(live.symbol).toBe('btc');
      expect(live.history.length).toBeGreaterThan(0);
      expect(live.price).toBe(live.history[live.history.length - 1].price);
    });
  });

  describe('nextLiveTickerForStream', () => {
    it('should advance the live series so a later point differs from peek', () => {
      const peek = tickerServiceController.peekLiveTickerForStream({
        symbol: 'eth',
      });
      const afterNext = tickerServiceController.nextLiveTickerForStream({
        symbol: 'eth',
      });

      const lastPeekTs = peek.history[peek.history.length - 1].timestamp;
      const lastNextTs =
        afterNext.history[afterNext.history.length - 1].timestamp;

      expect(lastNextTs).toBeGreaterThanOrEqual(lastPeekTs);
    });
  });
});
