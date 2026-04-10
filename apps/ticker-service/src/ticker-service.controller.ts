import { Controller } from '@nestjs/common';
import { TickerServiceService } from './ticker-service.service';
import { MessagePattern } from '@nestjs/microservices';
import type { ITickerAsset } from '@shared/common/types/ticker';

@Controller()
export class TickerServiceController {
  constructor(private readonly tickerServiceService: TickerServiceService) {}

  @MessagePattern({ cmd: 'getAvailableTickers' })
  getAvailableTickers(): ITickerAsset[] {
    return this.tickerServiceService.getAvailableTickers();
  }
}
