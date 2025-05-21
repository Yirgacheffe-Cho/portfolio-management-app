import SavingsSettings from '@/pages/Templates/SavingsSettings';
import TemplateInvestmentEditor from '@/pages/Templates/TemplateInvestmentEditor';

const TemplateSettings = () => {
  return (
    <div>
      <SavingsSettings></SavingsSettings>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">투자 자산 위치 설정</h2>
        <TemplateInvestmentEditor />
      </div>
    </div>
  );
};

export default TemplateSettings;
