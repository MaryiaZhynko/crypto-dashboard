import { Controller } from '@nestjs/common';
import { TickerServiceService } from './ticker-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TickerServiceController {
  constructor(private readonly tickerServiceService: TickerServiceService) {}

  @MessagePattern({ cmd: 'getAvailableTickers' })
  getAvailableTickers(): string[] {
    return this.tickerServiceService.getAvailableTickers();
  }
}
