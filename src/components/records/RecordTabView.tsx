import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AssetInputTable } from './AssetInputTable';
import { RecordSummaryPanel } from './RecordSummaryPanel';

/**
 * 🗂 RecordTabView
 * - 자산 입력 / 요약 탭을 전환하며 보여주는 컴포넌트
 */
export function RecordTabView() {
  return (
    <Tabs defaultValue="input" className="w-full">
      {/* 탭 선택 영역 */}
      <TabsList>
        <TabsTrigger value="input">📥 입력</TabsTrigger>
        <TabsTrigger value="summary">📊 요약</TabsTrigger>
      </TabsList>

      {/* 입력 탭 */}
      <TabsContent value="input">
        <AssetInputTable />
      </TabsContent>

      {/* 요약 탭 */}
      <TabsContent value="summary">
        <RecordSummaryPanel />
      </TabsContent>
    </Tabs>
  );
}
