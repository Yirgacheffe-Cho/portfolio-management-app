'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
  CartesianGrid,
} from 'recharts';

type Props = {
  data: Record<string, number | string>[];
  xKey?: string; // default: 'date'
  barKey?: string; // default: 'total'
};

export function GenericGrowthChartInner({
  data,
  xKey = 'date',
  barKey = 'total',
}: Props) {
  const keys = Object.keys(data?.[0] ?? {}).filter(
    (k) => k !== xKey && k !== barKey,
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis tickFormatter={(v) => `₩${(v / 10000).toFixed(0)}만`} />
        <Tooltip formatter={(val: number) => `₩${val.toLocaleString()}`} />
        <Legend />

        {barKey && <Bar dataKey={barKey} fill="hsl(var(--foreground) / 0.2)" />}

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
    </ResponsiveContainer>
  );
}
