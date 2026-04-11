import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { TickerObject, type Ticker } from '~/schemas/tickers';
import { getTickerWebSocketUrl } from '~/lib/ticker-api';
import { parseTickerWsEnvelope } from '~/lib/ticker-ws-envelope';

export type TickerSubscribePayload = {
  symbol: string;
};

export interface ITickerWebSocket {
  subscribe: (payload: TickerSubscribePayload) => string;
  unsubscribe: (subscriptionId: string) => void;
  isConnected: boolean;
  lastError: string | null;
  liveBySymbol: Record<string, Ticker>;
}

const TickerWebSocketContext = createContext<ITickerWebSocket | null>(null);

function flushServerSubscribes(ws: WebSocket, symbols: Iterable<string>) {
  if (ws.readyState !== WebSocket.OPEN) return;
  for (const symbol of symbols) {
    ws.send(
      JSON.stringify({
        event: 'subscribe',
        data: { symbol },
      }),
    );
  }
}

export function TickerWebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const idToSymbolRef = useRef<Map<string, string>>(new Map());
  const symbolRefCountRef = useRef<Map<string, number>>(new Map());

  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [liveBySymbol, setLiveBySymbol] = useState<Record<string, Ticker>>({});

  const sendServerSubscribe = useCallback((symbol: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        event: 'subscribe',
        data: { symbol },
      }),
    );
  }, []);

  const sendServerUnsubscribe = useCallback((symbol: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        event: 'unsubscribe',
        data: { symbol },
      }),
    );
  }, []);

  const subscribe = useCallback(
    (payload: TickerSubscribePayload) => {
      const id = crypto.randomUUID();
      const symbol = payload.symbol.trim();

      if (!symbol) return id;

      idToSymbolRef.current.set(id, symbol);

      const counts = symbolRefCountRef.current;
      const next = (counts.get(symbol) ?? 0) + 1;
      counts.set(symbol, next);

      if (next === 1) {
        sendServerSubscribe(symbol);
      }

      return id;
    },
    [sendServerSubscribe],
  );

  const unsubscribe = useCallback(
    (subscriptionId: string) => {
      const symbol = idToSymbolRef.current.get(subscriptionId);
      if (!symbol) return;

      idToSymbolRef.current.delete(subscriptionId);

      const counts = symbolRefCountRef.current;
      const prev = counts.get(symbol) ?? 1;
      const next = prev - 1;

      if (next <= 0) {
        counts.delete(symbol);
        sendServerUnsubscribe(symbol);
      } else {
        counts.set(symbol, next);
      }
    },
    [sendServerUnsubscribe],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = getTickerWebSocketUrl();
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setLastError(null);
      flushServerSubscribes(ws, symbolRefCountRef.current.keys());
    };

    ws.onclose = () => {
      setIsConnected(false);
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
          setLiveBySymbol((prev) => ({
            ...prev,
            [checked.symbol]: checked,
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
      ws.close();
    };
  }, []);

  const value = useMemo<ITickerWebSocket>(
    () => ({
      subscribe,
      unsubscribe,
      isConnected,
      lastError,
      liveBySymbol,
    }),
    [subscribe, unsubscribe, isConnected, lastError, liveBySymbol],
  );

  return (
    <TickerWebSocketContext.Provider value={value}>
      {children}
    </TickerWebSocketContext.Provider>
  );
}

export function useTickerWebSocket(): ITickerWebSocket {
  const ctx = useContext(TickerWebSocketContext);
  if (!ctx) {
    throw new Error(
      'useTickerWebSocket must be used within TickerWebSocketProvider',
    );
  }
  return ctx;
}
