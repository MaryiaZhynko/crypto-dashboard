import { Dashboard } from '~/components/dashboard';
import { fetchTickers } from '~/fetchers/tickers';
import type { Route } from './+types/home';

const PAGE_SIZE = 12;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const rawPage = Number.parseInt(url.searchParams.get('page') ?? '1', 10);

  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  let { items: tickers, totalPages } = await fetchTickers({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  if (totalPages >= 1 && page > totalPages) {
    const adjusted = await fetchTickers({
      limit: PAGE_SIZE,
      offset: (totalPages - 1) * PAGE_SIZE,
    });
    tickers = adjusted.items;
    totalPages = adjusted.totalPages;
  }

  return { tickers, totalPages };
}

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'Crypto Dashboard' },
    { name: 'description', content: 'Welcome to Crypto Dashboard!' },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <Dashboard
      tickers={loaderData.tickers}
      totalPages={loaderData.totalPages}
    />
  );
}
