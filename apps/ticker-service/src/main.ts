import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TickerServiceModule } from './ticker-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TickerServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.TICKER_LISTEN_HOST ?? '0.0.0.0',
        port: parseInt(process.env.TICKER_LISTEN_PORT ?? '4445', 10),
      },
    },
  );

  await app.listen();
}
bootstrap();
