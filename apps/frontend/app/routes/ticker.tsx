import type { LoaderFunctionArgs } from 'react-router';
import { Token } from '~/components/token';
import { fetchTicker } from '~/fetchers/tickers';
import type { Ticker } from '~/schemas/tickers';
import type { Route } from './+types/ticker';

export async function loader({ params }: LoaderFunctionArgs) {
  const symbol = params.symbol;

  if (!symbol) {
    throw new Response(null, { status: 404 });
  }

  const ticker: Ticker | null = await fetchTicker(symbol);

  if (!ticker) {
    throw new Response(null, { status: 404 });
  }

  return { ticker };
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
  return <Token ticker={loaderData.ticker} />;
}
