import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import type { Ticker } from '~/schemas/tickers';
import { Table } from './table';

interface DashboardProps {
  tickers: Ticker[];
}

export function Dashboard({ tickers }: DashboardProps) {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Top 100 Cryptocurrencies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table tickers={tickers} />
        </CardContent>
      </Card>
    </section>
  );
}
