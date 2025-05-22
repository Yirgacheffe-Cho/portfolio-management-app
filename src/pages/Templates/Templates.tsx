import { Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Spinner from '@/components/ui/spinner';
import SavingsSettings from '@/pages/Templates/SavingsSettings';
import TemplateInvestmentEditor from '@/pages/Templates/TemplateInvestmentEditor';
import { useTemplateInitializer } from '@/hooks/template/useTemplateInitializer';

const TemplateSettings = () => {
  // ✅ 템플릿 데이터를 불러오는 커스텀 훅 (단 한 번 호출)
  useTemplateInitializer();

  return (
    <Suspense fallback={<Spinner className="mt-8" />}>
      {/* ✅ 공통 Suspense 처리: 동일 데이터 기반의 하위 컴포넌트를 묶음 */}
      <Tabs defaultValue="savings" className="space-y-1">
        <TabsList className="grid w-full grid-cols-2 border rounded-lg bg-muted p-1">
          <TabsTrigger
            value="savings"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-sm font-medium"
          >
            목표 및 자산 분배
          </TabsTrigger>
          <TabsTrigger
            value="investment"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-sm font-medium"
          >
            자산 보관처 설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="savings">
          <SavingsSettings />
        </TabsContent>

        <TabsContent value="investment">
          <TemplateInvestmentEditor />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
};

export default TemplateSettings;
