import { useAtom, useAtomValue } from 'jotai';
import {
  recordInvestmentsAtom,
  recordMetaAtom,
  selectedDateAtom,
} from '@/store/records/recordAtoms';
import { useAutoSaveRecord } from '@/hooks/records/useAutoSaveRecord';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';

/**
 * 📥 AssetInputTable
 * - 상태: recordInvestmentsAtom
 * - 자동 저장: useAutoSaveRecord 내부에서 감지
 * - 해당 location에 없는 자산은 입력 불가로 "-" 표시
 * - 소수점 입력을 위해 string 상태값 별도 관리
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

  // ✅ 입력 문자열 상태를 따로 관리하여 소수점 중간 입력 지원
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const handleInput = (location: string, assetKey: string, value: string) => {
    const inputKey = `${location}_${assetKey}`;
    setInputValues((prev) => ({ ...prev, [inputKey]: value }));
  };
  const handleBlur = (location: string, assetKey: string) => {
    const inputKey = `${location}_${assetKey}`;
    const value = inputValues[inputKey];
    const [type, currency] = assetKey.split('_');

    const parsed = Number(value);

    const originalAsset = investments[location].find(
      (r) => r.type === type && r.currency === currency,
    );

    // ✅ 유효성 검사 실패 → 입력 복원
    if (!value || isNaN(parsed) || parsed <= 0) {
      setInputValues((prev) => ({
        ...prev,
        [inputKey]: originalAsset?.amount?.toString() ?? '',
      }));
      return;
    }

    // ✅ 유효 → 실제 상태 반영
    const updated = investments[location].map((r) => {
      if (r.type === type && r.currency === currency) {
        return { ...r, amount: parsed };
      }
      return r;
    });

    setInvestments({
      ...investments,
      [location]: updated,
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
                          inputMode="decimal" // 모바일에서도 숫자 키패드 유도
                          className="w-24 text-right"
                          value={
                            inputValues[`${location}_${assetKey}`] ??
                            asset?.amount?.toString() ??
                            ''
                          }
                          onChange={(e) => {
                            handleInput(location, assetKey, e.target.value);
                          }}
                          onBlur={() => {
                            handleBlur(location, assetKey);
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
