import { Module } from '@nestjs/common';

import { BackendController } from './backend.controller';
import { BackendService } from './backend.service';
import { TickerStreamGateway } from './ticker-stream.gateway';

@Module({
  imports: [],
  controllers: [BackendController],
  providers: [BackendService, TickerStreamGateway],
})
export class BackendModule {}
