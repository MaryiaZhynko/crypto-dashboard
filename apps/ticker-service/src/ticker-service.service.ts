import { Injectable } from '@nestjs/common';

@Injectable()
export class TickerServiceService {
  getAvailableTickers(): string[] {
    return ['BTC', 'ETH', 'XRP', 'DOGE', 'SOL'];
  }
}
