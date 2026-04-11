import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TickerObject } from '~/schemas/tickers';
import { getTickerWebSocketUrl } from '~/lib/ticker-api';
import { parseTickerWsEnvelope } from '~/lib/ticker-ws-envelope';
import type { Ticker } from '~/schemas/tickers';
import type { ILivePrice } from '~/types';

export interface ITickerListWsResult {
  livePrices: ILivePrice;
  connected: boolean;
  lastError: string | null;
}

export const useTickerListWs = (
  tickers: Ticker[],
  enabled = true,
): ITickerListWsResult => {
  const [livePricesBySymbol, setLivePricesBySymbol] = useState<ILivePrice>({});
  const [connected, setConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const subscribedRef = useRef<Set<string>>(new Set());

  const symbolsKey = useMemo(
    () =>
      [...new Set(tickers.map((t) => t.symbol.trim()).filter(Boolean))]
        .sort()
        .join('\0'),
    [tickers],
  );

  const livePrices = useMemo((): ILivePrice => {
    if (!symbolsKey.length) {
      return {};
    }

    const next: ILivePrice = {};
    for (const s of symbolsKey.split('\0')) {
      const price = livePricesBySymbol[s];
      if (price !== undefined) {
        next[s] = price;
      }
    }
    return next;
  }, [livePricesBySymbol, symbolsKey]);

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
      subscribedRef.current = new Set();
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

          setLivePricesBySymbol((prev) => ({
            ...prev,
            [checked.symbol]: checked.price,
          }));
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
      subscribedRef.current = new Set();
      ws.close();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !connected) return;

    const symbols =
      symbolsKey.length > 0 ? symbolsKey.split('\0') : ([] as string[]);

    for (const s of symbols) {
      subscribe(s);
    }

    subscribedRef.current = new Set(symbols);

    return () => {
      for (const s of subscribedRef.current) {
        unsubscribe(s);
      }

      subscribedRef.current = new Set();
    };
  }, [connected, enabled, subscribe, unsubscribe, symbolsKey]);

  return {
    livePrices,
    connected,
    lastError,
  };
};
