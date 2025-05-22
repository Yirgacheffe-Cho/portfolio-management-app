import { useEffect, useState, useTransition } from 'react';
import { useAtom } from 'jotai';
import { templateAtom } from '@/store/template/templateAtom';
import { AssetType, ASSET_TYPE_LIST } from '@/types/asset';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSaveTemplateGoal } from '@/hooks/template/useSaveTemplateMeta';
import { useSavingsForecast } from '@/hooks/template/useSavingsForecast';
import { useDelayedPending } from '@/hooks/common/useDelayedPending';
import { formatKorean } from '@/utils/formatKorean';

/**
 * ✅ SavingsSettings
 *
 * 사용자 자산 목표 및 분배 비율 설정 컴포넌트
 * - templateAtom 기반 초기값
 * - 각 항목은 0~100 범위 내 입력만 허용
 * - 총합 100% 초과 시 입력 무시
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

  const [isPending, startTransition] = useTransition();
  const isSpinnerVisible = useDelayedPending(isPending, 150);

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

  // 📊 예측 결과 계산
  const forecast = useSavingsForecast({
    savingsGoal: Number(savingsGoalInput || '0'),
    savingRate: Number(savingRateInput || '0'),
    allocations,
  });

  /**
   * 🧠 자산 항목 변경 핸들러
   * - 숫자만 허용
   * - 100 초과 값 무시
   * - 총합 100 초과되면 입력 무시
   */
  const handleAllocationChange = (key: AssetType, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const numeric = Number(val);
    if (numeric > 100) return;

    const next = { ...allocations, [key]: val };
    const nextTotal = Object.values(next).reduce(
      (acc, v) => acc + Number(v || '0'),
      0,
    );

    if (nextTotal > 100) return;

    startTransition(() => setAllocations(next));
  };

  const handleSave = () => {
    if (!isValid) return;

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
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 m-1">
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
        <p className="text-sm text-gray-500">
          {formatKorean(Number(savingsGoalInput || '0'))}
        </p>
      </div>

      {/* 저축률 */}
      <div className="space-y-1">
        <Label>저축률 (%)</Label>
        <Input
          disabled={!isEditMode}
          type="number" // 숫자 전용 처리 (브라우저가 min/max 적용함)
          min={0}
          max={100}
          value={savingRateInput}
          onChange={(e) => {
            const val = e.target.value;
            // 숫자 아닌 경우 무시
            if (!/^\d*$/.test(val)) return;
            const num = Number(val);
            // 100 초과하면 무시
            if (num > 100) return;
            setSavingRateInput(val);
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
                type="number" // 숫자 전용 처리 (브라우저가 min/max 적용함)
                min={0}
                max={100}
                value={allocations[key]}
                onChange={(e) => {
                  const val = e.target.value;
                  // 숫자 아닌 경우 무시
                  if (!/^\d*$/.test(val)) return;
                  const num = Number(val);
                  // 100 초과하면 무시
                  if (num > 100) return;
                  handleAllocationChange(key, e.target.value);
                }}
              />
            </div>
          ))}
        </div>
        <p className="text-sm mt-1 text-gray-400">
          ⚠ 현재 합계: {total}% (100%이어야 합니다)
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

      {/* 저장/수정 버튼 */}
      <div className="pt-4 flex justify-center">
        {isEditMode ? (
          <Button
            onClick={handleSave}
            disabled={!isValid}
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
