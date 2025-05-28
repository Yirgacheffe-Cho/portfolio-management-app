// components/report/ReportPage.tsx

import { useSnapshots } from '@/hooks/report/useSnapshots';
import { SnapshotKPI } from '@/components/report/SnapshotKPI';
import { SnapshotTableCard } from '@/components/report/SnapshotTableCard';
// import { SnapshotGrowthTable } from './SnapshotGrowthTable';
// import { AIInsightCard } from './AIInsightCard';

export function ReportPage() {
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
      {/* <SnapshotGrowthTable snapshots={snapshots} />
      <AIInsightCard snapshot={current} /> */}
    </section>
  );
}
export default ReportPage;
