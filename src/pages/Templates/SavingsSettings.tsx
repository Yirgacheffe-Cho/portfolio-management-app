import React, { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSavingsForecast } from '@/hooks/template/useSavingsForecast';
import { useDelayedPending } from '@/hooks/common/useDelayedPending';
import { formatKorean } from '@/utils/formatKorean';

const SavingsSettings = () => {
  const [savingsGoalInput, setSavingsGoalInput] = useState('');
  const [savingRateInput, setSavingRateInput] = useState('75');
  const [allocations, setAllocations] = useState({
    금: '25',
    비트코인: '25',
    현금: '25',
    주식: '25',
  });

  const [errors, setErrors] = useState<{ global?: string }>({});
  const [isPending, startTransition] = useTransition();
  const isSpinnerVisible = useDelayedPending(isPending, 150);

  const savingsGoal = Number(savingsGoalInput || '0');
  const savingRate = Number(savingRateInput || '0');
  const totalAllocation = Object.values(allocations).reduce(
    (acc, v) => acc + Number(v || '0'),
    0,
  );
  const isValid = totalAllocation === 100;

  const forecast = useSavingsForecast({
    savingsGoal,
    savingRate,
    allocations,
  });

  const handleAllocationChange = (key: string, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const value = Number(val);
    const temp = { ...allocations, [key]: val };
    const sum = Object.values(temp).reduce(
      (acc, v) => acc + Number(v || '0'),
      0,
    );

    if (isNaN(value) || value < 0) {
      setErrors({
        global: '숫자만 입력할 수 있으며, 음수는 허용되지 않습니다.',
      });
      return;
    }

    if (sum > 100) {
      setErrors({
        global: '총합이 100%를 초과할 수 없습니다.',
      });
      return;
    }

    startTransition(() => setAllocations(temp));
    setErrors({});
  };

  const handleSave = () => {
    if (!isValid || errors.global) return;
    console.log('✅ 저장할 데이터:', {
      savingsGoal,
      savingRate,
      allocations,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">기본 자산 설정</h2>

      {/* 목표 자산 */}
      <div className="space-y-2">
        <Label>1년 목표 자산</Label>
        <Input
          inputMode="numeric"
          pattern="\d*"
          value={savingsGoalInput}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) setSavingsGoalInput(val);
          }}
        />
        <span className="text-sm text-gray-500">
          {formatKorean(savingsGoal)}
        </span>
      </div>

      {/* 저축률 */}
      <div className="space-y-2">
        <Label>저축률 (%)</Label>
        <Input
          inputMode="numeric"
          pattern="\d*"
          value={savingRateInput}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) setSavingRateInput(val);
          }}
        />
      </div>

      {/* 자산 분배 */}
      <div className="space-y-2">
        <Label>자산 분배 비율 (%)</Label>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(allocations).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <Label>{key}</Label>
              <Input
                inputMode="numeric"
                pattern="\d*"
                value={value}
                onChange={(e) => handleAllocationChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* 통합 에러 메시지 */}
        <p
          className={`text-sm mt-1 transition-opacity duration-200 ${
            isValid && !errors.global
              ? 'text-transparent opacity-0'
              : 'text-red-500 opacity-100'
          }`}
        >
          {errors.global ||
            `⚠ 자산 비율 합계가 ${totalAllocation}%입니다. (100%이어야 합니다)`}
        </p>
      </div>

      {/* 예측 결과 */}
      <div>
        <Label className="mb-2">📊 예상 자산 분배 금액</Label>
        <div className="relative min-h-[80px]">
          <div
            className={`bg-muted/50 p-4 rounded-md border text-sm text-gray-700 space-y-1 transition-opacity duration-200 ${
              isPending ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {forecast.map((item) => (
              <div key={item.label}>
                {item.label}: {formatKorean(item.amount)}
              </div>
            ))}
          </div>
          <p
            className={`absolute top-4 left-4 text-sm text-gray-500 transition-opacity duration-200 ${
              isSpinnerVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            계산 중...
          </p>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="pt-4 flex justify-center">
        <Button
          onClick={handleSave}
          disabled={!isValid || !!errors.global}
          className="w-full max-w-xs"
        >
          저장하기
        </Button>
      </div>
    </div>
  );
};

export default SavingsSettings;
