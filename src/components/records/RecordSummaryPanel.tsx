import { useAtomValue } from 'jotai';
import {
  recordMetaAtom,
  recordInvestmentsAtom,
} from '@/store/records/recordAtoms';
import type { AssetRecord, AssetSnapCategory } from '@/types/asset';
import {
  InvestmentToAssetMap,
  AssetType,
  InvestmentType,
  InvestmentToSnapMap,
} from '@/types/asset';
import { cn } from '@/lib/utils';
import {
  getSnapPieDataFromMeta,
  getKrwValueFromMeta,
} from '@/utils/getSnapPieData';
import { PieChartCard } from '@/components/common/PieChartCard';
import { BarChartCard } from '@/components/common/BarChartCard';

export function RecordSummaryPanel() {
  const meta = useAtomValue(recordMetaAtom);
  const investments = useAtomValue(recordInvestmentsAtom);
  const exchangeRate = meta.exchangeRate;

  if (!exchangeRate) {
    return (
      <div className="text-sm text-red-600">
        ⚠ 환율 정보가 없습니다. 저장 당시 시세가 포함되지 않았습니다.
      </div>
    );
  }

  const getKrwValue = getKrwValueFromMeta(meta);

  const allRecords = Object.entries(investments).flatMap(([_, list]) => list);
  const total = allRecords.reduce((acc, r) => acc + getKrwValue(r), 0);

  const typeTotals: Record<AssetType, number> = {
    현금: 0,
    주식: 0,
    금: 0,
    코인: 0,
  };

  const locationTotals: Record<string, number> = {};
  const currencyTotals: Record<string, number> = {};

  Object.entries(investments).forEach(([location, records]) => {
    let sum = 0;
    records.forEach((r) => {
      const krw = getKrwValue(r);
      sum += krw;

      currencyTotals[r.currency] = (currencyTotals[r.currency] ?? 0) + krw;

      const assetType = InvestmentToAssetMap[r.type];
      if (assetType) {
        typeTotals[assetType] += krw;
      }
    });
    locationTotals[location] = sum;
  });

  const deltaTable = Object.entries(meta.targetAllocation).map(
    ([type, ratio]) => {
      const actualAmount = typeTotals[type as AssetType] ?? 0;
      const targetAmount = total * ratio;
      const diff = actualAmount - targetAmount;
      const percent = (actualAmount / targetAmount) * 100;
      const status =
        percent >= 110 ? '🟢 초과' : percent <= 80 ? '🔴 부족' : '⚪ 근접';

      return {
        type,
        ratio,
        targetAmount,
        actualAmount,
        percent,
        diff,
        status,
      };
    },
  );

  const pieData = getSnapPieDataFromMeta(investments, meta);
  const barData = Object.entries(locationTotals).map(([location, amount]) => ({
    name: location,
    value: amount,
  }));

  const currencyData = Object.entries(currencyTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const missing = Object.keys(meta.targetAllocation).filter((type) => {
    const asset = type as AssetType;
    return !allRecords.find(
      (r) => InvestmentToAssetMap[r.type] === asset && r.amount !== undefined,
    );
  });

  return (
    <div className="space-y-6 text-sm">
      <div>💰 총 자산 합계 (환산 기준): ₩{total.toLocaleString()}</div>

      <div>
        📉 저장된 환율 기준:{' '}
        {Object.entries(exchangeRate).map(([cur, rate]) => (
          <span key={cur} className="inline-block mr-3">
            {cur} = ₩{rate.toLocaleString()}
          </span>
        ))}
      </div>

      <PieChartCard title="📊 자산 구성 (자산 유형 기준)" data={pieData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChartCard title="🏦 보관처별 총 보유액" data={barData} />
        <PieChartCard
          title="💱 통화 기준 비중"
          data={currencyData}
          outerRadius={80}
        />
      </div>

      <table className="w-full text-sm border mt-4">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-2">자산 유형</th>
            <th className="p-2">목표 비중</th>
            <th className="p-2">목표 금액</th>
            <th className="p-2">실제 금액</th>
            <th className="p-2">달성률 📈</th>
            <th className="p-2">차이</th>
            <th className="p-2">상태</th>
          </tr>
        </thead>
        <tbody>
          {deltaTable.map((row) => (
            <tr key={row.type} className="border-t">
              <td className="p-2">{row.type}</td>
              <td className="p-2">{(row.ratio * 100).toFixed(1)}%</td>
              <td className="p-2">₩{row.targetAmount.toLocaleString()}</td>
              <td className="p-2">₩{row.actualAmount.toLocaleString()}</td>
              <td className="p-2">{row.percent.toFixed(1)}%</td>
              <td
                className={cn(
                  'p-2 text-right font-mono',
                  row.diff > 0 && 'text-blue-600',
                  row.diff < 0 && 'text-red-600',
                  row.diff === 0 && 'text-muted-foreground',
                )}
              >
                {row.diff > 0 && '+'}
                {row.diff < 0 && '-'}₩
                {Math.abs(row.diff).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="p-2">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {missing.length > 0 && (
        <div className="text-red-600">
          ⚠ 목표 항목 중 입력되지 않은 자산: {missing.join(', ')}
        </div>
      )}
    </div>
  );
}
