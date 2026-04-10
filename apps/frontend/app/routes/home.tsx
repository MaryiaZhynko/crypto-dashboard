import { Dashboard } from '~/components/dashboard';
import { fetchTickers } from '~/fetchers/tickers';
import type { Ticker } from '~/schemas/tickers';
import type { Route } from './+types/home';

export async function loader() {
  const tickers: Ticker[] = await fetchTickers();

  return { tickers };
}

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'Crypto Dashboard' },
    { name: 'description', content: 'Welcome to Crypto Dashboard!' },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Dashboard tickers={loaderData.tickers} />;
}
