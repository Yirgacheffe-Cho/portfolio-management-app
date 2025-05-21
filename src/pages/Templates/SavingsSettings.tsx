import React, { useState, useMemo, useTransition } from 'react';

const SavingsSettings = () => {
  const [savingsGoalInput, setSavingsGoalInput] = useState<string>('');
  const [savingRateInput, setSavingRateInput] = useState<string>('75');
  const [allocations, setAllocations] = useState({
    금: '25',
    비트코인: '25',
    현금: '25',
    주식: '25',
  });

  // ✅ 입력 시 UI 부드럽게 처리 (비동기 우선순위)
  const [isPending, startTransition] = useTransition();

  // ✅ 입력 유효성 에러 메시지 저장용
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ 숫자 입력 유효성 검사 및 업데이트
  const handleAllocationChange = (key: string, val: string) => {
    const value = Number(val);
    const temp = { ...allocations, [key]: val };

    if (isNaN(value) || value < 0) {
      setErrors((prev) => ({
        ...prev,
        [key]: '숫자만 입력 가능합니다 (0 이상)',
      }));
      return;
    }

    const sum = Object.values(temp).reduce(
      (acc, v) => acc + Number(v || '0'),
      0,
    );

    if (sum > 100) {
      setErrors((prev) => ({
        ...prev,
        [key]: '총합이 100%를 초과할 수 없습니다',
      }));
      return;
    }

    // 정상 입력이면 적용 및 에러 제거
    startTransition(() => setAllocations(temp));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const savingsGoal = Number(savingsGoalInput || '0');
  const savingRate = Number(savingRateInput || '0');
  const totalAllocation = Object.values(allocations).reduce(
    (a, b) => a + Number(b || '0'),
    0,
  );
  const isValid = totalAllocation === 100;

  const formatKorean = (num: number) => {
    const man = Math.floor(num / 10000);
    const won = num % 10000;
    const formattedMan = man ? `${man.toLocaleString('ko-KR')}만원` : '';
    const formattedWon = won ? `${won.toLocaleString('ko-KR')}원` : '';
    return [formattedMan, formattedWon].filter(Boolean).join(' ');
  };

  // ✅ 계산 캐싱으로 성능 최적화
  const forecast = useMemo(() => {
    return Object.entries(allocations).map(([key, percent]) => ({
      label: key,
      amount: Math.round(
        (Number(percent || '0') / 100) * (savingsGoal * (savingRate / 100)),
      ),
    }));
  }, [allocations, savingsGoal, savingRate]);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">기본 자산 설정</h2>

      {/* 목표 자산 */}
      <div>
        <label className="block text-sm font-medium mb-1">1년 목표 자산</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="border px-3 py-2 rounded w-full"
            value={savingsGoalInput}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setSavingsGoalInput(value);
              }
            }}
          />
        </div>
        <span className="text-gray-500 whitespace-nowrap">
          {formatKorean(savingsGoal)}
        </span>
      </div>

      {/* 저축률 */}
      <div>
        <label className="block text-sm font-medium mb-1">저축률 (%)</label>
        <input
          type="number"
          min={1}
          max={100}
          step="1"
          className="border px-3 py-2 rounded w-full"
          value={savingRateInput}
          onChange={(e) => setSavingRateInput(e.target.value)}
        />
      </div>

      {/* 자산 분배 */}
      <div>
        <label className="block text-sm font-medium mb-1">
          자산 분배 비율 (%)
        </label>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(allocations).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm text-gray-600 mb-1">{key}</label>
              <input
                type="number"
                className={`border px-3 py-2 rounded w-full ${
                  errors[key] ? 'border-red-500' : ''
                }`}
                value={value}
                onChange={(e) => handleAllocationChange(key, e.target.value)}
              />
              {errors[key] && (
                <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
              )}
            </div>
          ))}
        </div>
        {!isValid && (
          <p className="text-red-500 text-sm mt-2">
            ⚠ 자산 비율 합계가 {totalAllocation}%입니다. (100%이어야 합니다)
          </p>
        )}
      </div>

      {/* 예측 분배 결과 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          📊 예상 자산 분배 금액
        </label>
        {isPending ? (
          <p className="text-sm text-gray-500">계산 중...</p>
        ) : (
          <ul className="space-y-1 text-sm text-gray-700">
            {forecast.map((item) => (
              <li key={item.label}>
                {item.label}: {formatKorean(item.amount)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SavingsSettings;
