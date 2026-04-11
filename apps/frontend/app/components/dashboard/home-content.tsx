import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

import { DASHBOARD_TICKERS_PAGE_SIZE, fetchTickers } from '~/fetchers/tickers';
import type { Ticker } from '~/schemas/tickers';
import { Dashboard } from '~/components/dashboard';

type DashboardTickersPageData = { items: Ticker[]; totalPages: number };

const dashboardTickersQueryOptions = (
  page: number,
): UseQueryOptions<
  DashboardTickersPageData,
  Error,
  DashboardTickersPageData
> => ({
  queryKey: ['tickers', 'dashboard', page, DASHBOARD_TICKERS_PAGE_SIZE],
  queryFn: () => {
    return fetchTickers({
      offset: (page - 1) * DASHBOARD_TICKERS_PAGE_SIZE,
      limit: DASHBOARD_TICKERS_PAGE_SIZE,
    });
  },
});

const useDashboardTickersPage = (page: number) =>
  useQuery(dashboardTickersQueryOptions(page));

export function HomeContent() {
  const [searchParams] = useSearchParams();

  const rawPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  const { data, isPending, isError, error } = useDashboardTickersPage(page);

  if (isPending) {
    return <p className="text-muted-foreground">Loading dashboard…</p>;
  }

  if (isError) {
    return (
      <p className="text-destructive" role="alert">
        Could not load tickers: {error.message}
      </p>
    );
  }

  if (!data) {
    return null;
  }

  return <Dashboard tickers={data.items} totalPages={data.totalPages} />;
}
