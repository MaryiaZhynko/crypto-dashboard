import { useEffect, useMemo } from 'react';

import { useTickerWebSocket } from '~/contexts/ticker-websocket-context';
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
  const { isConnected, lastError, liveBySymbol, subscribe, unsubscribe } =
    useTickerWebSocket();

  const watchedSymbols = useMemo(
    () =>
      [
        ...new Set(
          tickers.map((ticker) => ticker.symbol.trim()).filter(Boolean),
        ),
      ].sort(),
    [tickers],
  );

  const livePrices = useMemo((): ILivePrice => {
    if (watchedSymbols.length === 0) {
      return {};
    }

    const next: ILivePrice = {};

    for (const symbol of watchedSymbols) {
      const ticker = liveBySymbol[symbol];
      if (ticker !== undefined) {
        next[symbol] = ticker.price;
      }
    }

    return next;
  }, [liveBySymbol, watchedSymbols]);

  useEffect(() => {
    if (!enabled || !isConnected || watchedSymbols.length === 0) return;

    const ids = watchedSymbols.map((symbol) => subscribe({ symbol }));

    return () => {
      for (const id of ids) {
        unsubscribe(id);
      }
    };
  }, [enabled, isConnected, subscribe, unsubscribe, watchedSymbols]);

  return {
    livePrices,
    connected: isConnected,
    lastError,
  };
};
