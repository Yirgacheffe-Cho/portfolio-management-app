import { useAtom } from 'jotai';
import { recordInvestmentsAtom } from '@/store/records/recordAtoms';
import {
  InvestmentType,
  CURRENCY_TYPE_LIST,
  CurrencyType,
} from '@/types/asset';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * 📥 AssetInputTable
 * - 보관처(location) x 자산 유형(type/currency) 매트릭스 입력 테이블
 * - 상태는 recordInvestmentsAtom에 실시간 반영
 */
export function AssetInputTable() {
  const [investments, setInvestments] = useAtom(recordInvestmentsAtom);

  // 📌 모든 location(key) 수집
  const locations = Object.keys(investments);

  // 📌 모든 자산 항목 추출 (중복 제거)
  const assetKeys = Array.from(
    new Set(
      Object.values(investments).flatMap((records) =>
        records.map((r) => `${r.type}_${r.currency}`),
      ),
    ),
  );

  // 📌 표 구성용 헤더 추출
  const headerLabels = assetKeys.map((key) => {
    const [type, currency] = key.split('_');
    return `${type} (${currency})`;
  });

  // 📌 상태 업데이트 핸들러
  const handleChange = (location: string, assetKey: string, value: string) => {
    const [type, currency] = assetKey.split('_');
    const next = investments[location].map((r) => {
      if (r.type === type && r.currency === currency) {
        return { ...r, amount: value === '' ? undefined : Number(value) };
      }
      return r;
    });
    setInvestments({
      ...investments,
      [location]: next,
    });
  };

  return (
    <div className="overflow-auto rounded-md border">
      <table className="min-w-full text-sm text-center">
        <thead>
          <tr className="bg-muted">
            <th className="px-2 py-2">보관처</th>
            {headerLabels.map((label, idx) => (
              <th key={idx} className="px-2 py-2">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location} className="border-t">
              <td className="font-medium px-2 py-1">{location}</td>
              {assetKeys.map((assetKey) => {
                const asset = investments[location].find(
                  (r) => `${r.type}_${r.currency}` === assetKey,
                );
                return (
                  <td key={assetKey} className="px-1 py-1">
                    <Input
                      type="number"
                      className="w-24 text-right"
                      value={asset?.amount ?? ''}
                      onChange={(e) =>
                        handleChange(location, assetKey, e.target.value)
                      }
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
