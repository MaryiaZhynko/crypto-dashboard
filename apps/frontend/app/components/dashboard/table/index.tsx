import { TextAlign, type ILivePrice } from '~/types';
import { Cell } from './cell';
import { HeadCell } from './head-cell';
import type { Ticker } from '~/schemas/tickers';
import { NavLink } from 'react-router';
import { PriceSparkline } from './price-history-graph';
import { formatCompactNumber, formatCurrency } from '~/lib/utils';

const STICKY_FIRST_HEAD = 'sticky left-0 z-20 bg-sidebar md:bg-card';
const STICKY_FIRST_BODY = 'sticky left-0 z-10 bg-sidebar md:bg-card';

const HEAD_CELL_PROPS: {
  name: string;
  textAlign?: TextAlign;
  className?: string;
}[] = [
  {
    name: 'Name',
    textAlign: TextAlign.LEFT,
    className: STICKY_FIRST_HEAD,
  },
  { name: 'Price' },
  { name: 'Market Cap' },
  { name: 'Volume' },
  { name: 'Supply' },
  {
    name: 'History (50 days)',
    textAlign: TextAlign.RIGHT,
  },
];

interface IProps {
  tickers: Ticker[];
  livePrices: ILivePrice;
}

export function Table({ tickers, livePrices }: IProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max border-collapse border-border">
        <thead className="border-b-2 border-border">
          <tr>
            {HEAD_CELL_PROPS.map(({ name, textAlign, className }) => (
              <HeadCell key={name} textAlign={textAlign} className={className}>
                {name}
              </HeadCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {tickers.map((ticker) => (
            <tr key={ticker.symbol} className="border-b border-border">
              <Cell className={STICKY_FIRST_BODY}>
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
              <Cell>
                {formatCurrency(livePrices[ticker.symbol] ?? ticker.price)}
              </Cell>
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
    </div>
  );
}
