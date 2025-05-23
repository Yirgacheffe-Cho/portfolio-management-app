/**
 * ✅ TemplateInvestmentEditor
 *
 * 투자 자산의 위치/구성 항목들을 설정하는 페이지
 * - 위치 추가, 항목 수정, 삭제 가능

 */

import { useEffect, useState } from 'react';
import { useAtomValue, useAtom } from 'jotai';
import { Plus, Save, Landmark } from 'lucide-react';

import {
  templateAtom,
  templateInvestmentsAtom,
} from '@/store/template/templateAtom';
import { useSaveTemplate } from '@/hooks/template/useSaveTemplate';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import LocationList from './LocationList';
import { InvestmentType, CurrencyType } from '@/types/asset';
import type { InvestmentMap } from '@/types/asset';

const TemplateInvestmentEditor = () => {
  const template = useAtomValue(templateAtom);
  useEffect(() => {
    console.log('🧪 templateAtom changed:', template);
  }, [template]);
  const [investments, setInvestments] = useAtom(templateInvestmentsAtom);
  const [newLocation, setNewLocation] = useState('');
  const { mutate: saveTemplate, isPending } = useSaveTemplate();

  const handleAddLocation = () => {
    const name = newLocation.trim();
    if (!name || investments[name]) return;
    setInvestments({ ...investments, [name]: [] });
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

    if (updated.length === 0) {
      const next = { ...investments };
      delete next[loc];
      setInvestments(next);
    } else {
      setInvestments({ ...investments, [loc]: updated });
    }
  };

  const handleAddItem = (loc: string) => {
    const updated = [
      ...investments[loc],
      { type: InvestmentType.CASH, currency: CurrencyType.KRW },
    ];
    setInvestments({ ...investments, [loc]: updated });
  };

  const handleRenameLocation = (oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) return;
    const updatedInvestments: InvestmentMap = {};
    for (const key in investments) {
      updatedInvestments[key === oldName ? newName : key] = investments[key];
    }
    setInvestments(updatedInvestments);
  };

  const handleSave = () => {
    if (!template) return;
    saveTemplate(template); // 전체 저장
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 space-y-6">
      <CardHeader className="flex items-center gap-2">
        <Landmark className="w-5 h-5 text-muted-foreground" />
        <CardTitle className="text-2xl">자산 보관처 설정</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 위치 입력 및 추가 */}
        <div className="flex items-end gap-2">
          <Input
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="새 자산 보관처 입력"
          />
          <Button onClick={handleAddLocation}>
            <Plus className="w-4 h-4 mr-1" />
            자산 보관처 추가
          </Button>
        </div>

        {/* 위치별 자산 리스트 */}
        <LocationList
          locations={investments}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onAddItem={handleAddItem}
          onRenameLocation={handleRenameLocation}
        />

        {/* 저장 버튼 */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            className="w-full max-w-xs mx-auto flex items-center justify-center gap-2"
            disabled={isPending}
          >
            <Save className="w-4 h-4" />
            {isPending ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateInvestmentEditor;
