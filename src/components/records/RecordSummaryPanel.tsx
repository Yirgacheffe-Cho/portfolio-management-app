import { useAtomValue } from 'jotai';
import {
  recordMetaAtom,
  recordInvestmentsAtom,
} from '@/store/records/recordAtoms';
import { CURRENCY_TYPE_LIST } from '@/types/asset';

/**
 * 📊 RecordSummaryPanel
 * - 자산 총합, 외화 비중, 목표 대비 분석, 누락 경고 등
 */
export function RecordSummaryPanel() {
  const meta = useAtomValue(recordMetaAtom);
  const investments = useAtomValue(recordInvestmentsAtom);

  // 1. 평탄화
  const allRecords = Object.values(investments).flat();

  // 2. 총합
  const total = allRecords.reduce((acc, cur) => acc + (cur.amount ?? 0), 0);

  // 3. 외화 비중 (USD, BTC, ETH)
  const foreignCurrencies = ['USD', 'BTC', 'ETH'];
  const foreign = foreignCurrencies.map((cur) => {
    const sum = allRecords
      .filter((r) => r.currency === cur)
      .reduce((acc, cur) => acc + (cur.amount ?? 0), 0);
    return {
      currency: cur,
      percent: total ? ((sum / total) * 100).toFixed(1) : '0.0',
    };
  });

  // 4. 목표 대비 분석
  const typeTotals: Record<string, number> = {};
  allRecords.forEach((r) => {
    if (!r.type) return;
    typeTotals[r.type] = (typeTotals[r.type] ?? 0) + (r.amount ?? 0);
  });

  const target = meta.targetAllocation;
  const delta: { type: string; diff: number }[] = Object.entries(target).map(
    ([type, goal]) => {
      const actualRatio = total ? (typeTotals[type] ?? 0) / total : 0;
      const diff = ((actualRatio - goal) * 100).toFixed(1);
      return { type, diff: parseFloat(diff) };
    },
  );

  // 5. 누락 자산 경고
  const missing = Object.keys(target).filter((type) => {
    const record = allRecords.find((r) => r.type === type);
    return record?.amount === undefined;
  });

  return (
    <div className="space-y-4 text-sm">
      <div>💰 총 자산 합계: ₩{total.toLocaleString()}</div>

      <div>
        💱 외화 비중:{' '}
        {foreign.map((f) => (
          <span key={f.currency} className="mr-2">
            {f.currency} {f.percent}%
          </span>
        ))}
      </div>

      <div>
        🎯 목표 대비:
        <ul className="list-disc list-inside">
          {delta.map((d) => (
            <li key={d.type}>
              {d.type}: {d.diff > 0 ? '+' : ''}
              {d.diff}%
            </li>
          ))}
        </ul>
      </div>

      {missing.length > 0 && (
        <div className="text-red-600">
          ⚠ 다음 자산이 입력되지 않았습니다: {missing.join(', ')}
        </div>
      )}
    </div>
  );
}
