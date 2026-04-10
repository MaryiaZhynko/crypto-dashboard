import { TextAlign } from '~/types';
import { Cell } from './cell';
import { HeadCell } from './head-cell';
import type { Ticker } from '~/schemas/tickers';
import { NavLink } from 'react-router';

const HEAD_CELL_PROPS = [
  {
    name: 'Name',
    textAlign: TextAlign.LEFT,
  },
  {
    name: 'Price',
    textAlign: TextAlign.LEFT,
  },
  {
    name: 'Market Cap',
    textAlign: TextAlign.LEFT,
  },
  {
    name: 'Volume',
    textAlign: TextAlign.LEFT,
  },
  {
    name: 'Supply',
    textAlign: TextAlign.LEFT,
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
      <thead className="border-b border-border">
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
            <Cell>{ticker.price}</Cell>
            <Cell>{ticker.marketCap}</Cell>
            <Cell>{ticker.volume}</Cell>
            <Cell>{ticker.supply}</Cell>
            <Cell>{ticker.history.length}</Cell>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
