// hooks/records/useAssetInputHandler.ts
import { useState } from 'react';
import { useAtom } from 'jotai';
import { recordInvestmentsAtom } from '@/store/records/recordAtoms';
import { useAutoSaveRecord } from './useAutoSaveRecord';

export function useAssetInputHandler() {
  const [investments, setInvestments] = useAtom(recordInvestmentsAtom);
  const { trigger, isSaving } = useAutoSaveRecord();
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const update = (location: string, assetKey: string, value: string) => {
    const inputKey = `${location}_${assetKey}`;
    setInputValues((prev) => ({ ...prev, [inputKey]: value }));

    const parsed = Number(value);
    if (!value || isNaN(parsed) || parsed <= 0) return;

    const [type, currency] = assetKey.split('_');
    const updated = investments[location].map((r) =>
      r.type === type && r.currency === currency ? { ...r, amount: parsed } : r,
    );

    setInvestments({ ...investments, [location]: updated });
    trigger.trigger(); // ✅ 디바운싱된 저장 트리거
  };

  return {
    inputValues,
    update,
    isSaving,
  };
}
