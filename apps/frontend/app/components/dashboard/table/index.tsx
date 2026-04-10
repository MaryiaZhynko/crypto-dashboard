import { TextAlign } from '~/types';
import { Cell } from './cell';
import { HeadCell } from './head-cell';
import type { Ticker } from '~/schemas/tickers';
import { NavLink } from 'react-router';
import { PriceSparkline } from './price-history-graph';
import { formatCompactNumber, formatCurrency } from '~/lib/utils';

const HEAD_CELL_PROPS = [
  {
    name: 'Name',
    textAlign: TextAlign.LEFT,
  },
  {
    name: 'Price',
  },
  {
    name: 'Market Cap',
  },
  {
    name: 'Volume',
  },
  {
    name: 'Supply',
  },
  {
    name: 'History',
    textAlign: TextAlign.RIGHT,
  },
];

interface IProps {
  tickers: Ticker[];
}

export function Table({ tickers }: IProps) {
  return (
    <table className="w-full border-collapse border-border">
      <thead className="border-b-2 border-border">
        <tr>
          {HEAD_CELL_PROPS.map((props) => (
            <HeadCell key={props.name} textAlign={props.textAlign}>
              {props.name}
            </HeadCell>
          ))}
        </tr>
      </thead>
      <tbody>
        {tickers.map((ticker) => (
          <tr key={ticker.symbol} className="border-b border-border">
            <Cell>
              <div className="flex min-w-0 max-w-[200px] items-center gap-2">
                <img
                  src={ticker.logo}
                  alt={ticker.name}
                  className="h-8 w-8 shrink-0 rounded-full"
                />
                <NavLink
                  to={`/${ticker.symbol}`}
                  className="flex min-w-0 flex-1 gap-1"
                >
                  <div className="min-w-0 truncate">{ticker.name}</div>
                  <span className="shrink-0 uppercase text-sm text-muted-foreground">
                    {ticker.symbol}
                  </span>
                </NavLink>
              </div>
            </Cell>
            <Cell>{formatCurrency(ticker.price)}</Cell>
            <Cell>{formatCurrency(ticker.marketCap)}</Cell>
            <Cell>{formatCurrency(ticker.volume)}</Cell>
            <Cell>{formatCompactNumber(ticker.supply)}</Cell>
            <Cell>
              <div className="flex justify-end">
                <PriceSparkline history={ticker.history} />
              </div>
            </Cell>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
