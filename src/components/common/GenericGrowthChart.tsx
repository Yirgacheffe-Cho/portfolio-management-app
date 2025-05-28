'use client';

import {
  ComposedChart,
  XAxis,
  YAxis,
  Bar,
  Line,
  CartesianGrid,
  LabelList,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';

type Props = {
  data: Record<string, number | string>[];
  xKey?: string; // 기본: 'date'
  barKey?: string; // 기본: 'total'
};

export function GenericGrowthChartInner({
  data,
  xKey = 'date',
  barKey = 'total',
}: Props) {
  const keys = Object.keys(data?.[0] ?? {}).filter(
    (k) => k !== xKey && k !== barKey,
  );

  const chartConfig: ChartConfig = {
    ...(barKey && {
      [barKey]: {
        label: barKey,
        color: 'hsl(240 4% 46% / 0.9)',
      },
    }),
    ...keys.reduce((acc, key, idx) => {
      acc[key] = {
        label: key,
        color: `hsl(var(--chart-${(idx % 5) + 1}))`,
      };
      return acc;
    }, {} as ChartConfig),
  };

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis tickFormatter={(v) => `₩${(v / 10000).toFixed(0)}만`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />

        {barKey && (
          <Bar
            dataKey={barKey}
            fill="hsl(240 4% 46% / 0.2)"
            radius={6}
            barSize={24}
          >
            <LabelList
              position="top"
              offset={6}
              className="fill-muted-foreground"
              formatter={(v: number) => `₩${Math.round(v).toLocaleString()}`}
              fontSize={11}
            />
          </Bar>
        )}

        {keys.map((key, idx) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={`hsl(var(--chart-${(idx % 5) + 1}))`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </ComposedChart>
    </ChartContainer>
  );
}
