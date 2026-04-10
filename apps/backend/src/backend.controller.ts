import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BackendService } from './backend.service';
import type {
  ITickerAsset,
  ITickersListResponse,
} from '@shared/common/types/ticker';

@Controller('tickers')
export class BackendController {
  constructor(private readonly backendService: BackendService) {}

  @Get()
  async getAvailableTickers(
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<ITickersListResponse> {
    return this.backendService.getAvailableTickers(limit, offset);
  }

  @Get(':symbol')
  async getTicker(@Param('symbol') symbol: string): Promise<ITickerAsset> {
    return this.backendService.getTicker(symbol);
  }
}
