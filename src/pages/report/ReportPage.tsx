// components/report/ReportPage.tsx

import { useSnapshots } from '@/hooks/report/useSnapshots';
import { SnapshotKPI } from '@/components/report/SnapshotKPI';
import { SnapshotTableCard } from '@/components/report/SnapshotTableCard';
import { AssetGrowthChartCard } from '@/components/report/AssetGrowthChartCard';
import { useTemplateInitializer } from '@/hooks/template/useTemplateInitializer';
import { AIInsightCard } from '@/components/common/AIInsightCard'; // ✅ 공통 컴포넌트
import { generatePromptFromSnapshots } from '@/utils/generatePromptFromSnapshot';
import { useGeminiInsight } from '@/hooks/report/useGeminiInsight';
import { useAtomValue } from 'jotai';
import { templateAtom } from '@/store/template/templateAtom';

export function ReportPage() {
  useTemplateInitializer();
  const { data: snapshots, isLoading } = useSnapshots();
  const { mutateAsync } = useGeminiInsight();
  const template = useAtomValue(templateAtom);

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

  const handleAnalyze = async () => {
    if (!template) return '❌ 템플릿이 없습니다.';
    const prompt = generatePromptFromSnapshots(
      snapshots,
      template.targetAllocation,
    );
    return await mutateAsync(prompt);
  };

  return (
    <section className="p-4 space-y-6">
      <SnapshotKPI
        current={current}
        previous={previous}
        oneYearAgo={oneYearAgo}
      />
      <SnapshotTableCard snapshots={snapshots} />
      <AssetGrowthChartCard snapshots={snapshots} />
      <AIInsightCard title="AI 분석 리포트" onAnalyze={handleAnalyze} />
    </section>
  );
}

export default ReportPage;
