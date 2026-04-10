import { Injectable, NotFoundException } from '@nestjs/common';
import coins from './data/coingecko-top100-snapshot.json';
import { buildPriceHistory } from './price-history';
import type {
  ITickerAsset,
  ITickersListResponse,
} from '@shared/common/types/ticker';

@Injectable()
export class TickerServiceService {
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

  getAvailableTickers(limit: number, offset: number): ITickersListResponse {
    const all = this.getAllTickers();
    const total = all.length;
    const pageSize = limit > 0 ? limit : 12;

    return {
      items: all.slice(offset, offset + pageSize),
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
}
