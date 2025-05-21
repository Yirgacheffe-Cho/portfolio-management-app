// src/pages/Templates/TemplateSettings.tsx
import SavingsSettings from '@/pages/Templates/SavingsSettings';
import TemplateInvestmentEditor from '@/pages/Templates/TemplateInvestmentEditor';
import { useTemplateInitializer } from '@/hooks/template/useTemplateInitializer';

const TemplateSettings = () => {
  useTemplateInitializer(); // ✅ 최초 진입 시 템플릿 불러오기

  return (
    <div>
      <SavingsSettings />
      <TemplateInvestmentEditor />
    </div>
  );
};

export default TemplateSettings;
