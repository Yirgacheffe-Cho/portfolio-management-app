import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Snapshot } from '@/types/report';
import { GenericGrowthChartInner } from '@/components/common/GenericGrowthChart';

type Props = {
  snapshots: Snapshot[];
};

export function AssetGrowthChartCard({ snapshots }: Props) {
  const chartData = snapshots.map((snap) => {
    const row: Record<string, number | string> = {
      date: formatChartDate(snap.date),
      total: snap.total,
    };
    snap.data.forEach((d) => {
      row[d.name] = d.value;
    });
    return row;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          📈 자산 성장 추이
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[360px]">
        <GenericGrowthChartInner data={chartData} />
      </CardContent>
    </Card>
  );
}

function formatChartDate(date: string): string {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  return `${year}.${month}`;
}
