import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { PricePoint } from '~/schemas/tickers';
import { formatCompactNumber, formatDate } from '~/lib/utils';

interface IProps {
  data: PricePoint[];
}

export function TokenChart({ data }: IProps) {
  return (
    <ChartContainer
      config={{}}
      className="w-full min-w-0 justify-start max-md:aspect-auto max-md:h-[min(52vh,420px)] md:h-auto md:aspect-video"
    >
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 8,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="timestamp"
          type="number"
          domain={['dataMin', 'dataMax']}
          stroke="var(--color-muted-foreground)"
          tickFormatter={(v: number | string) =>
            formatDate(new Date(Number(v)))
          }
        />
        <YAxis
          width={40}
          tickMargin={4}
          stroke="var(--color-muted-foreground)"
          tickFormatter={(v: number | string) => formatCompactNumber(Number(v))}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="var(--color-chart-3)"
          dot={{
            fill: 'var(--color-chart-3)',
          }}
          activeDot={{ r: 8, stroke: 'var(--color-chart-3)' }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </LineChart>
    </ChartContainer>
  );
}
