// src/pages/Templates/TemplateSettings.tsx
import SavingsSettings from '@/pages/Templates/SavingsSettings';
import TemplateInvestmentEditor from '@/pages/Templates/TemplateInvestmentEditor';
import { useTemplateInitializer } from '@/hooks/template/useTemplateInitializer';

const TemplateSettings = () => {
  useTemplateInitializer(); // ✅ 최초 진입 시 템플릿 불러오기

  return (
    <div>
      <SavingsSettings />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">투자 자산 위치 설정</h2>
        <TemplateInvestmentEditor />
      </div>
    </div>
  );
};

export default TemplateSettings;
