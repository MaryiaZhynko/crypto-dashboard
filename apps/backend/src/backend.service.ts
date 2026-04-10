import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

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

  async getAvailableTickers(): Promise<string[]> {
    return firstValueFrom(
      this.tickerService.send<string[]>({ cmd: 'getAvailableTickers' }, {}),
    );
  }

  async onModuleDestroy(): Promise<void> {
    await this.tickerService.close();
  }
}
