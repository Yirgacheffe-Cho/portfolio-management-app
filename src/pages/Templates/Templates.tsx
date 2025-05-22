import { Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Spinner from '@/components/ui/spinner';
import SavingsSettings from '@/pages/Templates/SavingsSettings';
import TemplateInvestmentEditor from '@/pages/Templates/TemplateInvestmentEditor';
import { useTemplateInitializer } from '@/hooks/template/useTemplateInitializer';

const TemplateSettings = () => {
  useTemplateInitializer(); // ✅ 최초 진입 시 템플릿 불러오기
  return (
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

      {/* 여백 추가 */}

      <TabsContent value="savings">
        <SavingsSettings />
      </TabsContent>

      <TabsContent value="investment">
        <TemplateInvestmentEditor />
      </TabsContent>
    </Tabs>
  );
};

export default TemplateSettings;
