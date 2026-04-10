import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type {
  ITickerAsset,
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
  ): Promise<ITickersListResponse> {
    return firstValueFrom(
      this.tickerService.send<ITickersListResponse>(
        { cmd: 'getAvailableTickers' },
        { limit, offset },
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
}
