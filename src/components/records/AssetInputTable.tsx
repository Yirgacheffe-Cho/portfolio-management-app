import { useAtom, useAtomValue } from 'jotai';
import {
  recordInvestmentsAtom,
  recordMetaAtom,
  selectedDateAtom,
} from '@/store/records/recordAtoms';
import { useAutoSaveRecord } from '@/hooks/records/useAutoSaveRecord';
import { Input } from '@/components/ui/input';
import { useMemo } from 'react';

/**
 * 📥 AssetInputTable
 * - 상태: recordInvestmentsAtom
 * - 자동 저장: useAutoSaveRecord 내부에서 감지
 * - 해당 location에 없는 자산은 입력 불가로 "-" 표시
 */
export function AssetInputTable() {
  const [investments, setInvestments] = useAtom(recordInvestmentsAtom);
  const meta = useAtomValue(recordMetaAtom);
  const date = useAtomValue(selectedDateAtom);

  // ✅ 자동 저장 훅 (debounce 내부 포함)
  const { isSaving } = useAutoSaveRecord();

  const locations = Object.keys(investments);

  // ✅ 모든 자산 종류 추출 (type + currency 조합으로 고유 키 구성)
  const assetKeys = useMemo(
    () =>
      Array.from(
        new Set(
          Object.values(investments).flatMap((records) =>
            records.map((r) => `${r.type}_${r.currency}`),
          ),
        ),
      ),
    [investments],
  );

  const headerLabels = assetKeys.map((key) => {
    const [type, currency] = key.split('_');
    return `${type} (${currency})`;
  });

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
    <div className="space-y-2">
      {/* 저장 상태 표시 */}
      <div className="text-sm text-muted-foreground px-1">
        {isSaving ? '저장 중...' : '자동 저장됨'}
      </div>

      {/* 자산 테이블 */}
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
                  const isEditable = !!asset;

                  return (
                    <td key={assetKey} className="px-1 py-1">
                      {isEditable ? (
                        <Input
                          type="text"
                          inputMode="numeric"
                          className="w-24 text-right"
                          value={asset?.amount ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!/^\d*$/.test(val)) return;
                            handleChange(location, assetKey, e.target.value);
                          }}
                        />
                      ) : (
                        <div className="text-muted-foreground w-24 text-right pr-2">
                          –
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
