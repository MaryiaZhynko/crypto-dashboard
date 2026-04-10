import { formatCurrency } from '~/lib/utils';
import type { Ticker } from '~/schemas/tickers';
import { Card, CardContent } from '~/components/ui/card';

interface IProps {
  ticker: Ticker;
}

const getStatRows = (ticker: Ticker) =>
  [
    { label: 'Market Cap', value: ticker.marketCap },
    { label: 'Volume', value: ticker.volume },
    { label: 'Supply', value: ticker.supply },
  ] as const;

export function TokenCard({ ticker }: IProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 items-center">
            <img
              src={ticker.logo}
              alt={ticker.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">{ticker.name}</span>
              <span className="text-sm font-medium text-muted-foreground uppercase">
                {ticker.symbol}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-xs font-medium text-muted-foreground">
              Price
            </span>
            <span className="text-xl font-bold">
              {formatCurrency(ticker.price)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {getStatRows(ticker).map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                {label}
              </span>
              <span className="text-xl font-bold">{formatCurrency(value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
