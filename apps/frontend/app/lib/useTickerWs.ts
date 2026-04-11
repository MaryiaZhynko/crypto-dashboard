import { useCallback, useEffect, useRef, useState } from 'react';

import { type Ticker, TickerObject } from '~/schemas/tickers';
import { getTickerWebSocketUrl } from '~/lib/ticker-api';
import { parseTickerWsEnvelope } from '~/lib/ticker-ws-envelope';

export interface ITickerWsOptions {
  symbol: string | null;
  enabled?: boolean;
}

export interface ITickerWsResult {
  ticker: Ticker | null;
  connected: boolean;
  lastError: string | null;
  subscribe: (symbol: string) => void;
  unsubscribe: (symbol: string) => void;
}

export const useTickerWs = ({
  symbol,
  enabled = true,
}: ITickerWsOptions): ITickerWsResult => {
  const [ticker, setTicker] = useState<Ticker | null>(null);

  const [connected, setConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  const subscribe = useCallback((symbol: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        event: 'subscribe',
        data: { symbol },
      }),
    );
  }, []);

  const unsubscribe = useCallback((symbol: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        event: 'unsubscribe',
        data: { symbol },
      }),
    );
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const url = getTickerWebSocketUrl();
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setLastError(null);
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
    };

    ws.onerror = () => {
      setLastError('WebSocket connection error');
    };

    ws.onmessage = (ev: MessageEvent<string>) => {
      const msg = parseTickerWsEnvelope(ev.data);

      if (!msg) return;

      if (msg.event === 'ticker') {
        try {
          const checked = TickerObject.check(msg.data);

          setTicker(checked);
          setLastError(null);
        } catch {
          console.error('Error parsing WebSocket message:', msg.data);
        }

        return;
      }

      if (msg.event === 'error') {
        const data = msg.data;

        if (
          data &&
          typeof data === 'object' &&
          'message' in data &&
          typeof data.message === 'string'
        ) {
          setLastError(data.message);
          return;
        }

        setLastError('Unknown error');
      }
    };

    return () => {
      wsRef.current = null;
      ws.close();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !connected || !symbol?.trim()) return;

    const symbolToSubscribe = symbol.trim();
    subscribe(symbolToSubscribe);

    return () => unsubscribe(symbolToSubscribe);
  }, [connected, enabled, subscribe, unsubscribe, symbol]);

  return {
    ticker,
    connected,
    lastError,
    subscribe,
    unsubscribe,
  };
};
