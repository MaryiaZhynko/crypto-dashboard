export function getTickerApiBaseUrl(): string {
  if (import.meta.env.SSR) {
    const serverRaw: unknown = process.env.VITE_TICKER_API_URL;
    if (typeof serverRaw === 'string' && serverRaw.trim().length > 0) {
      return serverRaw.trim();
    }
    return 'http://127.0.0.1:4444';
  }

  const raw: unknown = import.meta.env.VITE_TICKER_API_URL;
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.trim();
  }

  return 'http://127.0.0.1:4444';
}

export function getTickerWebSocketUrl(): string {
  const raw: unknown = import.meta.env.VITE_TICKER_WS_URL;
  const configured =
    typeof raw === 'string' && raw.length > 0 ? raw.trim() : '';

  if (configured) return configured;

  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const { protocol, host } = window.location;
    const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';

    return `${wsProtocol}//${host}/ws/tickers`;
  }

  return 'ws://127.0.0.1:4444/ws/tickers';
}
