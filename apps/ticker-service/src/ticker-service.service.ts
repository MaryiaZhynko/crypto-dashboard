import { Injectable, NotFoundException } from '@nestjs/common';
import coins from './data/coingecko-top100-snapshot.json';
import {
  buildFiveSecondPriceHistory,
  buildPriceHistory,
  createLiveFiveSecondSeries,
  type LiveFiveSecondSeries,
} from './price-history';
import type {
  ITickerAsset,
  ITickerPriceHistory,
  ITickersListResponse,
} from '@shared/common/types/ticker';

@Injectable()
export class TickerServiceService {
  private readonly liveSeriesBySymbol = new Map<string, LiveFiveSecondSeries>();

  private getAllTickers(): ITickerAsset[] {
    return coins.map((coin) => {
      const symbol = coin.symbol;
      const price = coin.current_price;

      return {
        symbol,
        name: coin.name,
        logo: coin.image,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        supply: coin.circulating_supply,
        price,
        history: buildPriceHistory(`${symbol}-${coin.name}`, price),
      };
    });
  }

  getAvailableTickers(
    limit: number,
    offset: number,
    search?: string,
  ): ITickersListResponse {
    let tickers = this.getAllTickers();

    const searchQuery = search?.trim().toLowerCase();
    if (searchQuery) {
      tickers = tickers.filter(
        (t) =>
          t.symbol.toLowerCase().includes(searchQuery) ||
          t.name.toLowerCase().includes(searchQuery),
      );
    }

    const total = tickers.length;
    const pageSize = limit > 0 ? limit : 12;

    return {
      items: tickers.slice(offset, offset + pageSize),
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  getTicker(symbol: string): ITickerAsset {
    const ticker = this.getAllTickers().find(
      (ticker) => ticker.symbol.toLowerCase() === symbol.toLowerCase(),
    );

    if (!ticker) {
      throw new NotFoundException(`Ticker ${symbol} not found`);
    }

    return ticker;
  }

  getTickerPriceHistory(symbol: string): ITickerPriceHistory {
    const ticker = this.getTicker(symbol);
    return buildFiveSecondPriceHistory(
      `${ticker.symbol}-${ticker.name}`,
      ticker.price,
    );
  }

  private getOrCreateLiveSeries(ticker: ITickerAsset): LiveFiveSecondSeries {
    const key = ticker.symbol.toLowerCase();

    let series = this.liveSeriesBySymbol.get(key);

    if (!series) {
      series = createLiveFiveSecondSeries(
        `${ticker.symbol}-${ticker.name}`,
        ticker.price,
      );
      this.liveSeriesBySymbol.set(key, series);
    }

    return series;
  }

  peekLiveTickerForStream(symbol: string): ITickerAsset {
    const ticker = this.getTicker(symbol);
    const series = this.getOrCreateLiveSeries(ticker);

    const history = series.getPoints();
    const last = history[history.length - 1];

    return { ...ticker, price: last.price, history };
  }

  nextLiveTickerForStream(symbol: string): ITickerAsset {
    const ticker = this.getTicker(symbol);

    const series = this.getOrCreateLiveSeries(ticker);
    series.advance();

    const history = series.getPoints();
    const last = history[history.length - 1];

    return { ...ticker, price: last.price, history };
  }
}
