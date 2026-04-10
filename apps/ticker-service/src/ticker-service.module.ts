import { Module } from '@nestjs/common';
import { TickerServiceController } from './ticker-service.controller';
import { TickerServiceService } from './ticker-service.service';

@Module({
  imports: [],
  controllers: [TickerServiceController],
  providers: [TickerServiceService],
})
export class TickerServiceModule {}
