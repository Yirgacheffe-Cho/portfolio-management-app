/**
 * ✅ useSavingsForecast
 *
 * 목표 자산, 저축률, 자산 분배 비율을 바탕으로
 * 항목별 예측 금액을 계산하여 리턴하는 훅
 */
import { useMemo } from 'react';

interface UseSavingsForecastProps {
  savingsGoal: number;
  savingRate: number;
  allocations: Record<string, string>;
}

interface ForecastResult {
  label: string;
  amount: number;
}

export const useSavingsForecast = ({
  savingsGoal,
  savingRate,
  allocations,
}: UseSavingsForecastProps): ForecastResult[] => {
  return useMemo(() => {
    const total = savingsGoal * (savingRate / 100);
    return Object.entries(allocations).map(([key, percent]) => ({
      label: key,
      amount: Math.round((Number(percent || '0') / 100) * total),
    }));
  }, [allocations, savingsGoal, savingRate]);
};
