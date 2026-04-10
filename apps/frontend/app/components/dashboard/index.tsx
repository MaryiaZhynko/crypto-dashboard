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
      <Card className="min-w-0 overflow-visible">
        <CardHeader>
          <CardTitle>Top 100 Cryptocurrencies</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 space-y-4">
          <Table tickers={tickers} />
          <TablePagination totalPages={totalPages} />
        </CardContent>
      </Card>
    </section>
  );
}
