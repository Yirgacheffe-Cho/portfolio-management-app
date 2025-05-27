// utils/snapshot/getSnapPieData.ts
import { InvestmentToSnapMap } from '@/types/asset';
import type { AssetRecord } from '@/types/asset';

type AssetSnapCategory = '현금' | '국내주식' | '해외주식' | '코인' | '금';

export function getSnapPieData(
  investments: Record<string, AssetRecord[]>,
  getKrwValue: (r: AssetRecord) => number,
) {
  const totals: Record<AssetSnapCategory, number> = {
    현금: 0,
    국내주식: 0,
    해외주식: 0,
    코인: 0,
    금: 0,
  };

  Object.values(investments).forEach((records) => {
    records.forEach((r) => {
      const category = InvestmentToSnapMap[r.type];
      const krw = getKrwValue(r);
      totals[category] += krw;
    });
  });

  return Object.entries(totals)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));
}
