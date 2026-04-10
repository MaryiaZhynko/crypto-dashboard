import { Controller, Get } from '@nestjs/common';
import { BackendService } from './backend.service';

@Controller('tickers')
export class BackendController {
  constructor(private readonly backendService: BackendService) {}

  @Get()
  async getAvailableTickers(): Promise<string[]> {
    return this.backendService.getAvailableTickers();
  }
}
