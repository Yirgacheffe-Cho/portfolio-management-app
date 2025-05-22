/**
 * ✅ SavingsSettings (최종 버전)
 *
 * 사용자 자산 목표 및 분배 비율 설정 컴포넌트
 * - templateAtom 기반 초기값 사용
 * - shadcn/ui 스타일 + lucide 아이콘 제한적 활용
 * - 각 입력은 0~100 사이 값만 허용, 총합 100% 초과 시 무시
 */

import { useEffect, useState, useTransition } from 'react';
import { useAtom } from 'jotai';
import { templateAtom } from '@/store/template/templateAtom';
import { AssetType, ASSET_TYPE_LIST } from '@/types/asset';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSaveTemplateGoal } from '@/hooks/template/useSaveTemplateMeta';
import { useSavingsForecast } from '@/hooks/template/useSavingsForecast';
import { useDelayedPending } from '@/hooks/common/useDelayedPending';
import { formatKorean } from '@/utils/formatKorean';

import { Settings, PieChart, BarChart3, Edit, Check } from 'lucide-react';

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

  // 📌 초기 상태 설정
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

  const forecast = useSavingsForecast({
    savingsGoal: Number(savingsGoalInput || '0'),
    savingRate: Number(savingRateInput || '0'),
    allocations,
  });

  // 📌 자산 항목 입력 핸들러
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

  // 📌 저장 핸들러
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

  if (!template) {
    return (
      <p className="text-sm text-muted-foreground text-center">
        불러오는 중...
      </p>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto p-6 space-y-6">
      <CardHeader className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-muted-foreground" />
        <CardTitle className="text-2xl">기본 자산 설정</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 목표 자산 입력 */}
        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base">
            1년 목표 자산
          </Label>
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
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatKorean(Number(savingsGoalInput || '0'))}
          </p>
        </div>

        {/* 저축률 입력 */}
        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base">
            저축률 (%)
          </Label>
          <Input
            disabled={!isEditMode}
            type="number"
            min={0}
            max={100}
            value={savingRateInput}
            onChange={(e) => {
              const val = e.target.value;
              if (!/^\d*$/.test(val)) return;
              const num = Number(val);
              if (num > 100) return;
              setSavingRateInput(val);
            }}
          />
        </div>

        {/* 자산 분배 */}
        <div className="space-y-2 border rounded-lg p-4 bg-muted/10">
          <Label className="flex items-center gap-1 text-base">
            <PieChart className="w-4 h-4 text-muted-foreground" />
            자산 분배 (%)
          </Label>

          <div className="grid grid-cols-2 gap-4">
            {ASSET_TYPE_LIST.map((key) => (
              <div key={key}>
                <Label>{key}</Label>
                <Input
                  disabled={!isEditMode}
                  type="number"
                  min={0}
                  max={100}
                  value={allocations[key]}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^\d*$/.test(val)) return;
                    if (Number(val) > 100) return;
                    handleAllocationChange(key, val);
                  }}
                />
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            ⚠ 현재 합계: {total}% (100%이어야 합니다)
          </p>
        </div>

        {/* 예측 결과 */}
        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            예상 자산 분배 금액
          </Label>
          <div className="relative min-h-[80px]">
            <div
              className={`bg-muted/50 p-4 rounded-md border text-sm text-foreground space-y-1 transition-opacity duration-200 ${
                isPending ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {forecast.map((item) => (
                <div key={item.label} className="tabular-nums">
                  {item.label}: {formatKorean(item.amount)}
                </div>
              ))}
            </div>
            <p
              className={`absolute top-4 left-4 text-sm text-muted-foreground transition-opacity duration-200 ${
                isSpinnerVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              계산 중...
            </p>
          </div>
        </div>

        {/* 저장 / 수정 버튼 */}
        <div className="pt-4">
          <Button
            onClick={isEditMode ? handleSave : () => setIsEditMode(true)}
            disabled={isEditMode && !isValid}
            className="w-full max-w-xs mx-auto flex items-center justify-center gap-2"
          >
            {isEditMode ? (
              <Check className="w-4 h-4" />
            ) : (
              <Edit className="w-4 h-4" />
            )}
            {isEditMode ? '저장하기' : '수정하기'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsSettings;
