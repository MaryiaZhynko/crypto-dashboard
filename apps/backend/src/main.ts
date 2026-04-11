import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';

import { BackendModule } from './backend.module';

async function bootstrap() {
  const app = await NestFactory.create(BackendModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({ origin: true });
  await app.listen(process.env.PORT ?? 4444);
}
bootstrap();
