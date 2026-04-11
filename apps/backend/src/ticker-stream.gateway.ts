import { Logger, OnModuleDestroy } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { BackendService } from './backend.service';

type SubscribePayload = { symbol?: string };

@WebSocketGateway({
  path: '/ws/tickers',
  transports: ['websocket'],
})
export class TickerStreamGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleDestroy
{
  private readonly logger = new Logger(TickerStreamGateway.name);
  private readonly subscriptions = new Map<WebSocket, Set<string>>();
  private pushTimer?: ReturnType<typeof setInterval>;

  constructor(private readonly backendService: BackendService) {}

  afterInit(): void {
    const intervalMs = Number.parseInt(
      process.env.TICKER_WS_INTERVAL_MS ?? '5000',
      10,
    );

    this.pushTimer = setInterval(() => {
      this.broadcastLiveTickers();
    }, intervalMs);
  }

  onModuleDestroy(): void {
    if (!this.pushTimer) return;

    clearInterval(this.pushTimer);
  }

  handleConnection(client: WebSocket): void {
    this.subscriptions.set(client, new Set());
  }

  handleDisconnect(client: WebSocket): void {
    this.subscriptions.delete(client);
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() body: SubscribePayload,
  ) {
    const symbol = body?.symbol?.trim();
    if (!symbol) {
      return { event: 'error', data: { message: 'symbol is required' } };
    }

    const symbols = this.subscriptions.get(client) ?? new Set<string>();
    symbols.add(symbol);

    this.subscriptions.set(client, symbols);
    await this.pushLiveTicker(client, symbol, false);

    return { event: 'subscribed', data: { symbol } };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() body: SubscribePayload,
  ) {
    const symbol = body?.symbol?.trim();

    if (!symbol) {
      return { event: 'error', data: { message: 'symbol is required' } };
    }

    this.subscriptions.get(client)?.delete(symbol);
    return { event: 'unsubscribed', data: { symbol } };
  }

  private async broadcastLiveTickers(): Promise<void> {
    for (const [client, symbols] of this.subscriptions) {
      if (client.readyState !== WebSocket.OPEN || symbols.size === 0) {
        continue;
      }

      for (const symbol of symbols) {
        await this.pushLiveTicker(client, symbol, true);
      }
    }
  }

  private async pushLiveTicker(
    client: WebSocket,
    symbol: string,
    advance: boolean,
  ): Promise<void> {
    if (client.readyState !== WebSocket.OPEN) return;

    try {
      const ticker = advance
        ? await this.backendService.nextLiveTickerForStream(symbol)
        : await this.backendService.peekLiveTickerForStream(symbol);

      client.send(JSON.stringify({ event: 'ticker', data: ticker }));
    } catch (err) {
      this.logger.warn(`Ticker WS push failed for ${symbol}`, err);

      client.send(
        JSON.stringify({
          event: 'error',
          data: { symbol, message: 'ticker not found' },
        }),
      );
    }
  }
}
