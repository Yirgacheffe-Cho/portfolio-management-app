import { useAtomValue } from 'jotai';
import {
  recordMetaAtom,
  recordInvestmentsAtom,
} from '@/store/records/recordAtoms';
import { InvestmentToAssetMap, AssetType } from '@/types/asset';
import { cn } from '@/lib/utils';
import {
  getSnapPieDataFromMeta,
  getKrwValueFromMeta,
} from '@/utils/getSnapPieData';
import { PieChartCard } from '@/components/common/PieChartCard';
import { BarChartCard } from '@/components/common/BarChartCard';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Banknote,
  BarChart2,
  PieChart,
  Building2,
  CircleDollarSign,
  Target,
  AlertTriangle,
} from 'lucide-react';

export function RecordSummaryPanel() {
  const meta = useAtomValue(recordMetaAtom);
  const investments = useAtomValue(recordInvestmentsAtom);
  const exchangeRate = meta.exchangeRate;

  if (!exchangeRate) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertTriangle className="w-4 h-4" />
        환율 정보가 없습니다. 저장 당시 시세가 포함되지 않았습니다.
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
      const percent =
        targetAmount === 0 ? 0 : (actualAmount / targetAmount) * 100;
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
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center gap-2 text-base font-semibold">
          <Banknote className="w-4 h-4" />총 자산 합계
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          ₩{total.toLocaleString()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center gap-2 text-base font-semibold">
          <BarChart2 className="w-4 h-4" />
          저장된 환율 기준
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {Object.entries(exchangeRate).map(([cur, rate]) => (
            <div key={cur}>
              {cur} = ₩{rate.toLocaleString()}
            </div>
          ))}
        </CardContent>
      </Card>

      <PieChartCard title={'자산 구성 (자산 유형 기준)'} data={pieData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChartCard title={'보관처별 총 보유액'} data={barData} />
        <PieChartCard
          title={'통화 기준 비중'}
          data={currencyData}
          outerRadius={80}
        />
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2 text-base font-semibold">
          <Target className="w-4 h-4" />
          목표 달성 현황
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>자산 유형</TableHead>
                <TableHead>목표 비중</TableHead>
                <TableHead>목표 금액</TableHead>
                <TableHead>실제 금액</TableHead>
                <TableHead>달성률</TableHead>
                <TableHead className="text-right">차이</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deltaTable.map((row) => (
                <TableRow key={row.type}>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{(row.ratio * 100).toFixed(1)}%</TableCell>
                  <TableCell>₩{row.targetAmount.toLocaleString()}</TableCell>
                  <TableCell>₩{row.actualAmount.toLocaleString()}</TableCell>
                  <TableCell>{row.percent.toFixed(1)}%</TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-mono',
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
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {missing.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="w-4 h-4" />
          목표 항목 중 입력되지 않은 자산: {missing.join(', ')}
        </div>
      )}
    </div>
  );
}
