import { useQuery } from '@tanstack/react-query';
import { Token } from '~/components/token';
import { fetchTicker, fetchTickerPriceHistory } from '~/fetchers/tickers';
import type { PricePoint, Ticker } from '~/schemas/tickers';
import type { Route } from './+types/ticker';

export type TickerLoaderData = {
  symbol: string;
  ticker: Ticker;
  priceHistory: PricePoint[];
};

export function meta() {
  const title = 'Crypto Dashboard';

  return [
    { title },
    {
      name: 'description',
      content:
        'A look at the latest news and trends for a specific cryptocurrency.',
    },
  ];
}

export default function TickerPage({ params }: Route.ComponentProps) {
  const { symbol } = params;

  const tickerQuery = useQuery({
    queryKey: ['ticker', symbol],
    queryFn: (): Promise<Ticker | null> => fetchTicker(symbol),
    staleTime: 30_000,
  });

  const historyQuery = useQuery({
    queryKey: ['ticker-history', symbol],
    queryFn: async (): Promise<PricePoint[]> => {
      const history = await fetchTickerPriceHistory(symbol);

      if (history) return history;

      const ticker = await fetchTicker(symbol);
      return ticker?.history ?? [];
    },
  });

  const ticker = tickerQuery.data;
  const priceHistory = historyQuery.data ?? [];

  if (!ticker) {
    return null;
  }

  return <Token ticker={ticker} priceHistory={priceHistory} />;
}
