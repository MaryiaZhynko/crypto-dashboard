import { cn } from '~/lib/utils';
import { Link } from 'react-router';
import type { Ticker } from '~/schemas/tickers';

interface IProps {
  ticker: Ticker;
  handleResetState: () => void;
}

export function TokenSearchLink({ ticker, handleResetState }: IProps) {
  return (
    <Link
      to={`/${encodeURIComponent(ticker.symbol)}`}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:bg-accent focus-visible:outline-none',
      )}
      onClick={handleResetState}
    >
      {ticker.logo && (
        <img
          src={ticker.logo}
          alt=""
          className="size-6 shrink-0 rounded-full"
          loading="lazy"
        />
      )}

      <span className="min-w-0 flex-1 inline-flex items-center gap-1 truncate">
        <span className="font-medium">{ticker.name}</span>
        <span className="text-muted-foreground uppercase">{ticker.symbol}</span>
      </span>
    </Link>
  );
}
