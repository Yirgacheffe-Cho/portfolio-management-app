import { useAtomValue } from 'jotai';
import {
  recordInvestmentsAtom,
  selectedDateAtom,
} from '@/store/records/recordAtoms';
import { useMemo } from 'react';
import { AssetRow } from './AssetRow';

export function AssetInputTable() {
  const investments = useAtomValue(recordInvestmentsAtom);
  const date = useAtomValue(selectedDateAtom);

  const assetKeys = useMemo(() => {
    return Array.from(
      new Set(
        Object.values(investments).flatMap((records) =>
          records.map((r) => `${r.type}_${r.currency}`),
        ),
      ),
    );
  }, [investments]);

  return (
    <div className="overflow-auto rounded-md border">
      <table className="min-w-full text-sm text-center">
        <thead>
          <tr className="bg-muted">
            <th className="px-2 py-2">보관처</th>
            {assetKeys.map((key) => {
              const [type, currency] = key.split('_');
              return (
                <th key={key} className="px-2 py-2">
                  {type} ({currency})
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(investments).map(([location, records]) => (
            <AssetRow
              key={location}
              location={location}
              assetKeys={assetKeys}
              records={records}
              date={date}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
