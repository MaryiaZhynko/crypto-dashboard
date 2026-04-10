import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { PricePoint } from '~/schemas/tickers';
import { cn } from '~/lib/utils';

interface IProps {
  history: PricePoint[];
  className?: string;
}

export function PriceSparkline({ history, className }: IProps) {
  if (history.length < 2) {
    return (
      <span className="inline-block min-w-40 text-right text-sm tabular-nums text-muted-foreground">
        —
      </span>
    );
  }

  const data = history.map((point, i) => ({ i, price: point.price }));

  return (
    <div className={cn('h-8 w-full min-w-40 shrink-0', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
        >
          <XAxis dataKey="i" hide />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--color-chart-2)"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
