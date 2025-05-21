import { useEffect, useState } from 'react';
import LocationList from './LocationList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Save } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { templateAtom } from '@/store/template/templateAtom';
import { useSaveTemplateInvestments } from '@/hooks/template/useSaveTemplateInvestments';
import { InvestmentType, CurrencyType } from '@/types/asset';
import type { InvestmentMap } from '@/types/asset';
const TemplateInvestmentEditor = () => {
  const template = useAtomValue(templateAtom);
  const [investments, setInvestments] = useState<InvestmentMap>({});
  const [newLocation, setNewLocation] = useState('');
  const { mutate: saveInvestments, isPending } = useSaveTemplateInvestments();

  useEffect(() => {
    if (template?.investments) {
      setInvestments(template.investments);
    }
  }, [template]);

  const handleAddLocation = () => {
    if (!newLocation.trim() || investments[newLocation]) return;
    setInvestments({ ...investments, [newLocation]: [] });
    setNewLocation('');
  };

  const handleUpdateItem = (
    loc: string,
    idx: number,
    type: InvestmentType,
    currency: CurrencyType,
  ) => {
    const updated = [...investments[loc]];
    updated[idx] = { type, currency };
    setInvestments({ ...investments, [loc]: updated });
  };

  const handleDeleteItem = (loc: string, idx: number) => {
    const updated = [...investments[loc]];
    updated.splice(idx, 1);
    setInvestments({ ...investments, [loc]: updated });
  };

  const handleAddItem = (loc: string) => {
    const updated = [
      ...investments[loc],
      { type: InvestmentType.CASH, currency: CurrencyType.KRW },
    ];
    setInvestments({ ...investments, [loc]: updated });
  };

  const handleSave = () => {
    saveInvestments(investments);
  };

  return (
    <div className="max-w-3xl mx-auto m-1">
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          투자 자산 위치 설정
        </h2>

        <div className="flex items-end gap-2">
          <Input
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="새 위치 입력"
          />
          <Button onClick={handleAddLocation}>
            <Plus className="w-4 h-4 mr-1" />
            위치 추가
          </Button>
        </div>

        <LocationList
          locations={investments}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onAddItem={handleAddItem}
        />

        <div className="pt-4 border-t mt-6">
          <Button onClick={handleSave} className="w-full" disabled={isPending}>
            <Save className="w-4 h-4 mr-2" />
            {isPending ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateInvestmentEditor;
