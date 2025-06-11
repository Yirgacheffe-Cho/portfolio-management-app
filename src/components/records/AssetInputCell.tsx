import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  recordInvestmentsAtom,
  recordMetaAtom,
  selectedDateAtom,
} from '@/store/records/recordAtoms';
import type { InvestmentType, CurrencyType } from '@/types/asset';
import { useAutoSaveRecord } from '@/hooks/records/useAutoSaveRecord';

type Props = {
  amount?: number;
  location: string;
  type: InvestmentType;
  currency: CurrencyType;
};

export function AssetInputCell({ amount, location, type, currency }: Props) {
  const [local, setLocal] = useState(amount?.toString() ?? '');
  const isValidNumberInput = (val: string) => /^(\d+)?(\.)?(\d+)?$/.test(val);
  // 외부 값 동기화
  useEffect(() => {
    setLocal(amount?.toString() ?? '');
  }, [amount]);

  const investments = useAtomValue(recordInvestmentsAtom); // 읽기 전용
  const meta = useAtomValue(recordMetaAtom);
  const date = useAtomValue(selectedDateAtom);

  const { trigger } = useAutoSaveRecord(investments, meta, date);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (next === '' || isValidNumberInput(next)) {
      setLocal(next);

      const parsed = Number(next);
      if (!isNaN(parsed)) {
        const target = investments[location]?.find(
          (r) => r.type === type && r.currency === currency,
        );
        if (target) {
          target.amount = parsed; // 🔁 in-place 수정
          trigger.trigger(); // 💾 디바운싱된 저장
        }
      }
    }
  };

  return (
    <Input
      value={local}
      onChange={handleChange}
      inputMode="decimal"
      className="w-24 text-right"
    />
  );
}
