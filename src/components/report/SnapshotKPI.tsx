'use client';

import type { Snapshot } from '@/types/report';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  PiggyBank,
  Wallet,
} from 'lucide-react';
import { formatFullDate } from '@/utils/dateUtils';
type SnapshotKPIProps = {
  current: Snapshot;
  previous?: Snapshot;
  oneYearAgo?: Snapshot;
};

export function SnapshotKPI({
  current,
  previous,
  oneYearAgo,
}: SnapshotKPIProps) {
  const formatRate = (rate: number) =>
    `${rate > 0 ? '+' : ''}${rate.toFixed(1)}%`;

  const calcDelta = (a: number, b: number) => {
    const diff = a - b;
    const rate = b === 0 ? 0 : (diff / b) * 100;
    return { diff, rate };
  };

  const prev = previous ? calcDelta(current.total, previous.total) : null;
  const year = oneYearAgo ? calcDelta(current.total, oneYearAgo.total) : null;

  const getValue = (s: Snapshot, name: string) =>
    s.data.find((d) => d.name === name)?.value ?? 0;

  const currentCash = getValue(current, '현금');
  const yearCash = oneYearAgo ? getValue(oneYearAgo, '현금') : null;
  const currentCashRate = currentCash / current.total;
  const yearCashRate =
    yearCash !== null && oneYearAgo ? yearCash / oneYearAgo.total : null;

  const topGainers =
    oneYearAgo &&
    current.data
      .map((d) => {
        const prev = getValue(oneYearAgo, d.name);
        return { name: d.name, diff: d.value - prev };
      })
      .sort((a, b) => b.diff - a.diff)
      .slice(0, 2);

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          {formatFullDate(current.date)} 기준 자산 요약
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        <KpiBox label="총 자산" value={`₩${current.total.toLocaleString()}`} />

        <KpiBox
          label="전달 대비"
          value={prev ? formatRate(prev.rate) : '없음'}
          variant={
            prev
              ? prev.rate > 0
                ? 'up'
                : prev.rate < 0
                  ? 'down'
                  : 'neutral'
              : 'neutral'
          }
        />

        <KpiBox
          label="1년 전 대비"
          value={year ? formatRate(year.rate) : '없음'}
          variant={
            year
              ? year.rate > 0
                ? 'up'
                : year.rate < 0
                  ? 'down'
                  : 'neutral'
              : 'neutral'
          }
        />

        <KpiBox
          label="주요 기여 자산군"
          value={
            topGainers && topGainers.length > 0
              ? topGainers
                  .map((g) => `${g.name}: ₩${g.diff.toLocaleString()}`)
                  .join(', ')
              : '-'
          }
        />

        <KpiBox
          label="현금 비중 변화"
          value={
            yearCashRate !== null
              ? `${(yearCashRate * 100).toFixed(1)}% → ${(currentCashRate * 100).toFixed(1)}%`
              : '-'
          }
        />
      </CardContent>
    </Card>
  );
}

function KpiBox({
  label,
  value,
  variant = 'neutral',
}: {
  label: string;
  value: string;
  variant?: 'up' | 'down' | 'neutral';
}) {
  const color =
    variant === 'up'
      ? 'text-green-600'
      : variant === 'down'
        ? 'text-red-600'
        : 'text-foreground';

  const Icon =
    variant === 'up' ? TrendingUp : variant === 'down' ? TrendingDown : null;
  return (
    <div className="flex flex-col gap-1">
      <div className="text-muted-foreground">{label}</div>
      <div
        className={`text-base font-semibold flex items-center gap-1 ${color}`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {value}
      </div>
    </div>
  );
}
