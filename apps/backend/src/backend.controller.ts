import { Controller, Get } from '@nestjs/common';
import { BackendService } from './backend.service';
import type { ITickerAsset } from '@shared/common/types/ticker';

@Controller('tickers')
export class BackendController {
  constructor(private readonly backendService: BackendService) {}

  @Get()
  async getAvailableTickers(): Promise<ITickerAsset[]> {
    return this.backendService.getAvailableTickers();
  }
}
