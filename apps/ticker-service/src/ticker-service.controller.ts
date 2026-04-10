import { Controller } from '@nestjs/common';
import { TickerServiceService } from './ticker-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { ITickerAsset } from '@shared/common/types/ticker';

@Controller()
export class TickerServiceController {
  constructor(private readonly tickerServiceService: TickerServiceService) {}

  @MessagePattern({ cmd: 'getAvailableTickers' })
  getAvailableTickers(): ITickerAsset[] {
    return this.tickerServiceService.getAvailableTickers();
  }

  @MessagePattern({ cmd: 'getTicker' })
  getTicker(@Payload() payload: { symbol: string }): ITickerAsset {
    return this.tickerServiceService.getTicker(payload.symbol);
  }
}
