// utils/snapshot/getSnapPieData.ts
import { InvestmentToSnapMap } from '@/types/asset';
import type { AssetRecord } from '@/types/asset';
import type { RecordMeta } from '@/types/record';

type AssetSnapCategory = '현금' | '국내주식' | '해외주식' | '코인' | '금';

/**
 * 📊 메타 정보 + 투자 내역을 기반으로
 * 자산군별 합계를 환율 적용 후 계산하여 반환
 * @param investments 위치별 투자 자산 목록
 * @param meta 환율, 목표 비중 등 포함된 메타 정보
 * @returns PieChart용 { name, value }[]
 */
export function getSnapPieDataFromMeta(
  investments: Record<string, AssetRecord[]>,
  meta: RecordMeta,
): { name: AssetSnapCategory; value: number }[] {
  const { exchangeRate } = meta;
  if (!exchangeRate) return [];

  // ✅ 환산 함수 받아두기 (1번만 실행)
  const getKrwValue = getKrwValueFromMeta(meta);

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
      const krw = getKrwValue(r); // ✅ 여기서 사용
      totals[category] += krw;
    });
  });

  return Object.entries(totals)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name: name as AssetSnapCategory,
      value,
    }));
}
/**
 * 💱 메타 정보 기반 KRW 환산 함수 생성기
 * - 외부에서 환율을 매번 직접 넘기지 않고도 사용할 수 있게 함
 * @param meta RecordMeta (exchangeRate 포함)
 * @returns (r: AssetRecord) => number
 */
export function getKrwValueFromMeta(meta: RecordMeta) {
  const { exchangeRate } = meta;

  return (r: AssetRecord): number => {
    if (!exchangeRate) return 0;
    if (r.currency === 'USD') return (r.amount ?? 0) * exchangeRate.USD;
    if (r.currency === 'BTC') return (r.amount ?? 0) * exchangeRate.BTC;
    if (r.currency === 'ETH') return (r.amount ?? 0) * exchangeRate.ETH;
    return r.amount ?? 0;
  };
}
