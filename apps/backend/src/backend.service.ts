import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type {
  ITickerAsset,
  ITickerPriceHistory,
  ITickersListResponse,
} from '@shared/common/types/ticker';

@Injectable()
export class BackendService implements OnModuleDestroy {
  private tickerService: ClientProxy;

  constructor() {
    this.tickerService = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.TICKER_SERVICE_HOST ?? '127.0.0.1',
        port: parseInt(process.env.TICKER_SERVICE_PORT ?? '4445', 10),
      },
    });
  }

  async getAvailableTickers(
    limit: number,
    offset: number,
    search?: string,
  ): Promise<ITickersListResponse> {
    return firstValueFrom(
      this.tickerService.send<ITickersListResponse>(
        { cmd: 'getAvailableTickers' },
        { limit, offset, search },
      ),
    );
  }

  async onModuleDestroy(): Promise<void> {
    await this.tickerService.close();
  }

  async getTicker(symbol: string): Promise<ITickerAsset> {
    return firstValueFrom(
      this.tickerService.send<ITickerAsset>({ cmd: 'getTicker' }, { symbol }),
    );
  }

  async getTickerPriceHistory(symbol: string): Promise<ITickerPriceHistory> {
    return firstValueFrom(
      this.tickerService.send<ITickerPriceHistory>(
        { cmd: 'getTickerPriceHistory' },
        { symbol },
      ),
    );
  }

  async peekLiveTickerForStream(symbol: string): Promise<ITickerAsset> {
    return firstValueFrom(
      this.tickerService.send<ITickerAsset>(
        { cmd: 'peekLiveTickerForStream' },
        { symbol },
      ),
    );
  }

  async nextLiveTickerForStream(symbol: string): Promise<ITickerAsset> {
    return firstValueFrom(
      this.tickerService.send<ITickerAsset>(
        { cmd: 'nextLiveTickerForStream' },
        { symbol },
      ),
    );
  }
}
