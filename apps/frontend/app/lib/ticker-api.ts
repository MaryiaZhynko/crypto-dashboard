export function getTickerApiBaseUrl(): string {
  return process.env.TICKER_API_URL ?? 'http://127.0.0.1:4444';
}
