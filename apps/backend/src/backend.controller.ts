import { Controller, Get, Param } from '@nestjs/common';
import { BackendService } from './backend.service';
import type { ITickerAsset } from '@shared/common/types/ticker';

@Controller('tickers')
export class BackendController {
  constructor(private readonly backendService: BackendService) {}

  @Get()
  async getAvailableTickers(): Promise<ITickerAsset[]> {
    return this.backendService.getAvailableTickers();
  }

  @Get(':symbol')
  async getTicker(@Param('symbol') symbol: string): Promise<ITickerAsset> {
    return this.backendService.getTicker(symbol);
  }
}
