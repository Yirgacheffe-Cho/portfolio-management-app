import { useAtom } from 'jotai';
import { recordInvestmentsAtom } from '@/store/records/recordAtoms';
import { useAutoSaveRecord } from '@hooks/records/useAutoSaveRecord';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';

const getInputKey = (location: string, assetKey: string) =>
  `${location}_${assetKey}`;

const isValidNumberInput = (value: string) => /^(\d+)?(\.)?(\d+)?$/.test(value);

const parseAmount = (value: string): number | null => {
  const parsed = Number(value);
  return !value || isNaN(parsed) || parsed <= 0 ? null : parsed;
};

export function AssetInputTable() {
  const [investments, setInvestments] = useAtom(recordInvestmentsAtom);
  const { trigger, isSaving } = useAutoSaveRecord(); // ✅ 변경된 훅
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const locations = Object.keys(investments);

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

  const handleInput = (location: string, assetKey: string, value: string) => {
    const inputKey = getInputKey(location, assetKey);
    setInputValues((prev) => ({ ...prev, [inputKey]: value }));

    const parsed = parseAmount(value);
    if (parsed === null) return;

    const [type, currency] = assetKey.split('_');
    const updated = investments[location].map((r) =>
      r.type === type && r.currency === currency ? { ...r, amount: parsed } : r,
    );

    setInvestments({ ...investments, [location]: updated });
    trigger.trigger(); // ✅ 디바운싱된 저장 트리거
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground px-1">
        {isSaving ? '저장 중...' : '자동 저장됨'}
      </div>

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
                  const inputKey = getInputKey(location, assetKey);

                  return (
                    <td key={assetKey} className="px-1 py-1">
                      {isEditable ? (
                        <Input
                          type="text"
                          inputMode="decimal"
                          className="w-24 text-right"
                          value={
                            inputValues[inputKey] ??
                            asset?.amount?.toString() ??
                            ''
                          }
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (isValidNumberInput(raw) || raw === '') {
                              handleInput(location, assetKey, raw);
                            }
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
