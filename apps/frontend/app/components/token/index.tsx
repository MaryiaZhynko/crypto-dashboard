import type { PricePoint, Ticker } from '~/schemas/tickers';
import { Card, CardContent } from '~/components/ui/card';
import { TokenChart } from './token-chart';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '~/components/ui/breadcrumb';
import { TokenCard } from './token-card';
import { TokenSearch } from './tokens-search';

interface IProps {
  ticker: Ticker;
  priceHistory: PricePoint[];
}

export function Token({ ticker, priceHistory }: IProps) {
  return (
    <section className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{ticker.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4">
        <div className="flex flex-col gap-4">
          <TokenSearch />
          <TokenCard ticker={ticker} />
        </div>

        <Card className="lg:col-span-2">
          <CardContent>
            <TokenChart data={priceHistory} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
