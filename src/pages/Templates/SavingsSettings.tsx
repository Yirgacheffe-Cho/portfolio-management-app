import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { templateAtom } from '@/store/template/templateAtom';
import { AssetType, ASSET_TYPE_LIST } from '@/types/asset';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSaveTemplateGoal } from '@/hooks/template/useSaveTemplateMeta';

/**
 * 💾 자산 목표/저축률/분배 비율 설정 UI
 * - templateAtom의 상태를 기반으로 초기화
 * - 수정 후 저장 시 Firestore에 일부 필드만 merge 저장
 */
const SavingsSettings = () => {
  const [template] = useAtom(templateAtom);
  const saveGoal = useSaveTemplateGoal();

  const [isEditMode, setIsEditMode] = useState(false);
  const [savingsGoalInput, setSavingsGoalInput] = useState('');
  const [savingRateInput, setSavingRateInput] = useState('');
  const [allocations, setAllocations] = useState<Record<AssetType, string>>(
    () =>
      Object.fromEntries(ASSET_TYPE_LIST.map((key) => [key, ''])) as Record<
        AssetType,
        string
      >,
  );
  const [errors, setErrors] = useState<string | null>(null);

  // 📌 초기값 세팅
  useEffect(() => {
    if (!template) return;

    setSavingsGoalInput(String(template.savingsGoal ?? ''));
    setSavingRateInput(String((template.savingRate ?? 0) * 100));

    const initAlloc = Object.fromEntries(
      ASSET_TYPE_LIST.map((key) => [
        key,
        String((template.targetAllocation?.[key] ?? 0) * 100),
      ]),
    ) as Record<AssetType, string>;

    setAllocations(initAlloc);
  }, [template]);

  const total = Object.values(allocations).reduce(
    (acc, v) => acc + Number(v || '0'),
    0,
  );
  const isValid = total === 100;

  const handleAllocationChange = (key: AssetType, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const next = { ...allocations, [key]: val };
    const sum = Object.values(next).reduce(
      (acc, v) => acc + Number(v || '0'),
      0,
    );

    if (sum > 100) {
      setErrors('총합이 100%를 초과할 수 없습니다.');
    } else {
      setErrors(null);
      setAllocations(next);
    }
  };

  const handleSave = () => {
    if (!isValid || errors) return;

    const targetAllocation = Object.fromEntries(
      ASSET_TYPE_LIST.map((key) => [
        key,
        Number(allocations[key] || '0') / 100,
      ]),
    ) as Record<AssetType, number>;

    saveGoal.mutate(
      {
        savingsGoal: Number(savingsGoalInput),
        savingRate: Number(savingRateInput) / 100,
        targetAllocation,
      },
      {
        onSuccess: () => setIsEditMode(false),
      },
    );
  };

  if (!template) return <p className="text-sm text-center">불러오는 중...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">기본 자산 설정</h2>

      {/* 목표 자산 */}
      <div className="space-y-1">
        <Label>1년 목표 자산</Label>
        <Input
          disabled={!isEditMode}
          inputMode="numeric"
          value={savingsGoalInput}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setSavingsGoalInput(e.target.value);
            }
          }}
        />
      </div>

      {/* 저축률 */}
      <div className="space-y-1">
        <Label>저축률 (%)</Label>
        <Input
          disabled={!isEditMode}
          inputMode="numeric"
          value={savingRateInput}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setSavingRateInput(e.target.value);
            }
          }}
        />
      </div>

      {/* 자산 분배 */}
      <div className="space-y-1">
        <Label>자산 분배 (%)</Label>
        <div className="grid grid-cols-2 gap-4">
          {ASSET_TYPE_LIST.map((key) => (
            <div key={key}>
              <Label>{key}</Label>
              <Input
                disabled={!isEditMode}
                inputMode="numeric"
                value={allocations[key]}
                onChange={(e) => handleAllocationChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <p
          className={`text-sm mt-1 ${isValid ? 'text-gray-400' : 'text-red-500'}`}
        >
          ⚠ 현재 합계: {total}% (100%이어야 합니다)
        </p>

        {errors && <p className="text-sm text-red-500">{errors}</p>}
      </div>

      {/* 버튼 */}
      <div className="pt-4 flex justify-center">
        {isEditMode ? (
          <Button
            onClick={handleSave}
            disabled={!isValid || !!errors}
            className="w-full max-w-xs"
          >
            저장하기
          </Button>
        ) : (
          <Button
            onClick={() => setIsEditMode(true)}
            className="w-full max-w-xs"
          >
            수정하기
          </Button>
        )}
      </div>
    </div>
  );
};

export default SavingsSettings;
