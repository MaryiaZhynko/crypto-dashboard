import { Injectable } from '@nestjs/common';
import coins from './data/coingecko-top100-snapshot.json';
import { buildPriceHistory } from './price-history';
import type { ITickerAsset } from '@shared/common/types/ticker';

@Injectable()
export class TickerServiceService {
  getAvailableTickers(): ITickerAsset[] {
    return coins.map((coin) => {
      const symbol = coin.symbol.toUpperCase();
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
}
