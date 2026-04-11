import { useEffect, useMemo } from 'react';

import { useTickerWebSocket } from '~/contexts/ticker-websocket-context';
import { type Ticker } from '~/schemas/tickers';

export interface ITickerWsOptions {
  symbol: string | null;
  enabled?: boolean;
}

export interface ITickerWsResult {
  ticker: Ticker | null;
  connected: boolean;
  lastError: string | null;
  subscribe: (symbol: string) => string;
  unsubscribe: (subscriptionId: string) => void;
}

export const useTickerWs = ({
  symbol,
  enabled = true,
}: ITickerWsOptions): ITickerWsResult => {
  const { isConnected, lastError, liveBySymbol, subscribe, unsubscribe } =
    useTickerWebSocket();

  const symbolKey = symbol?.trim() ?? '';

  const ticker = useMemo(() => {
    if (!symbolKey) return null;
    return liveBySymbol[symbolKey] ?? null;
  }, [liveBySymbol, symbolKey]);

  useEffect(() => {
    if (!enabled || !isConnected || !symbolKey) return;

    const id = subscribe({ symbol: symbolKey });
    return () => unsubscribe(id);
  }, [enabled, isConnected, subscribe, unsubscribe, symbolKey]);

  return {
    ticker,
    connected: isConnected,
    lastError,
    subscribe: (symbol: string) => subscribe({ symbol: symbol }),
    unsubscribe,
  };
};
