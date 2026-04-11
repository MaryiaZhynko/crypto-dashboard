import { Controller } from '@nestjs/common';
import { TickerServiceService } from './ticker-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type {
  ITickerAsset,
  ITickerPriceHistory,
  ITickersListResponse,
} from '@shared/common/types/ticker';

@Controller()
export class TickerServiceController {
  constructor(private readonly tickerServiceService: TickerServiceService) {}

  @MessagePattern({ cmd: 'getAvailableTickers' })
  getAvailableTickers(
    @Payload()
    payload: { limit?: number; offset?: number; search?: string } = {},
  ): ITickersListResponse {
    const limit = payload.limit ?? 12;
    const offset = payload.offset ?? 0;
    return this.tickerServiceService.getAvailableTickers(
      limit,
      offset,
      payload.search,
    );
  }

  @MessagePattern({ cmd: 'getTicker' })
  getTicker(@Payload() payload: { symbol: string }): ITickerAsset {
    return this.tickerServiceService.getTicker(payload.symbol);
  }

  @MessagePattern({ cmd: 'getTickerPriceHistory' })
  getTickerPriceHistory(
    @Payload() payload: { symbol: string },
  ): ITickerPriceHistory {
    return this.tickerServiceService.getTickerPriceHistory(payload.symbol);
  }

  @MessagePattern({ cmd: 'peekLiveTickerForStream' })
  peekLiveTickerForStream(
    @Payload() payload: { symbol: string },
  ): ITickerAsset {
    return this.tickerServiceService.peekLiveTickerForStream(payload.symbol);
  }

  @MessagePattern({ cmd: 'nextLiveTickerForStream' })
  nextLiveTickerForStream(
    @Payload() payload: { symbol: string },
  ): ITickerAsset {
    return this.tickerServiceService.nextLiveTickerForStream(payload.symbol);
  }
}
