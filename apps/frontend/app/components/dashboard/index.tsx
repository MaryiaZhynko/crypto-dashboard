import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import type { Ticker } from '~/schemas/tickers';
import { Table } from './table';
import { TablePagination } from './table/table-pagination';

interface DashboardProps {
  tickers: Ticker[];
  totalPages: number;
}

export function Dashboard({ tickers, totalPages }: DashboardProps) {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Top 100 Cryptocurrencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table tickers={tickers} />
          <TablePagination totalPages={totalPages} />
        </CardContent>
      </Card>
    </section>
  );
}
