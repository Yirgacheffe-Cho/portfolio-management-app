// components/report/ReportPage.tsx

import { useSnapshots } from '@/hooks/report/useSnapshots';
import { SnapshotKPI } from '@/components/report/SnapshotKPI';
import { SnapshotTableCard } from '@/components/report/SnapshotTableCard';
import { AssetGrowthChartCard } from '@/components/report/AssetGrowthChartCard';
import { useTemplateInitializer } from '@/hooks/template/useTemplateInitializer';
import { AIInsightContainer } from '@components/report/AIInsightContainer';

export function ReportPage() {
  useTemplateInitializer();
  const { data: snapshots, isLoading } = useSnapshots();

  if (isLoading) return <div className="p-4">📊 리포트 불러오는 중...</div>;
  if (!snapshots || snapshots.length === 0)
    return (
      <div className="p-4 text-muted-foreground">
        📭 저장된 스냅샷이 없습니다.
      </div>
    );

  const current = snapshots.at(-1)!;
  const previous = snapshots.at(-2);
  const oneYearAgo = snapshots.find(
    (s) => Number(s.date) === Number(current.date) - 100,
  );

  return (
    <section className="p-4 space-y-6">
      <SnapshotKPI
        current={current}
        previous={previous}
        oneYearAgo={oneYearAgo}
      />
      <SnapshotTableCard snapshots={snapshots} />
      <AssetGrowthChartCard snapshots={snapshots} />
      <AIInsightContainer snapshots={snapshots} />
    </section>
  );
}
export default ReportPage;
