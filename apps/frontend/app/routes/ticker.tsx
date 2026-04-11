import type { LoaderFunctionArgs } from 'react-router';
import { Token } from '~/components/token';
import { fetchTicker, fetchTickerPriceHistory } from '~/fetchers/tickers';
import type { Route } from './+types/ticker';

export async function loader({ params }: LoaderFunctionArgs) {
  const symbol = params.symbol;

  if (!symbol) {
    throw new Response(null, { status: 404 });
  }

  const [ticker, priceHistory] = await Promise.all([
    fetchTicker(symbol),
    fetchTickerPriceHistory(symbol),
  ]);

  if (!ticker) {
    throw new Response(null, { status: 404 });
  }

  return {
    ticker,
    priceHistory: priceHistory ?? ticker.history,
  };
}

export function meta({ data }: Route.MetaArgs) {
  const title = data?.ticker
    ? `${data.ticker.name} - ${data.ticker.symbol} | Crypto Dashboard`
    : 'Crypto Dashboard';

  return [
    { title },
    {
      name: 'description',
      content:
        'A look at the latest news and trends for a specific cryptocurrency.',
    },
  ];
}

export default function TickerPage({ loaderData }: Route.ComponentProps) {
  return (
    <Token ticker={loaderData.ticker} priceHistory={loaderData.priceHistory} />
  );
}
