export function getTickerApiBaseUrl(): string {
  return process.env.TICKER_API_URL ?? 'http://127.0.0.1:4444';
}

export function getTickerWebSocketUrl(): string {
  const raw: unknown = import.meta.env.VITE_TICKER_WS_URL;

  const configured =
    typeof raw === 'string' && raw.length > 0 ? raw.trim() : undefined;

  if (configured) return configured;

  return 'ws://127.0.0.1:4444/ws/tickers';
}
