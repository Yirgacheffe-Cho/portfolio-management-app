import type { Snapshot } from '@/types/report';
import { formatFullDate } from '@/utils/dateUtils';
import { ASSET_SNAP_CATEGORIES } from '@/types/asset';
import { cn } from '@/lib/utils';

type Props = {
  snapshots: Snapshot[];
};

export function SnapshotTable({ snapshots }: Props) {
  const sorted = [...snapshots].sort((a, b) => Number(a.date) - Number(b.date));
  const categories = ASSET_SNAP_CATEGORIES;
  const calcChange = (curr: Snapshot, base?: Snapshot): string | null => {
    if (!base) return null;
    const rate = ((curr.total - base.total) / base.total) * 100;
    return `${rate >= 0 ? '+' : ''}${rate.toFixed(1)}%`;
  };

  const getValue = (snap: Snapshot, name: string) =>
    snap.data.find((d) => d.name === name)?.value ?? 0;

  return (
    <div className="max-h-[420px] overflow-y-auto overflow-x-auto text-sm border rounded-md">
      <table className="min-w-[900px] text-left border-collapse">
        <thead className="bg-muted text-muted-foreground font-medium sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">날짜</th>
            {categories.map((cat) => (
              <th key={cat} className="px-2 py-2 text-right">
                {cat}
              </th>
            ))}
            <th className="px-4 py-2 text-right">합계</th>
            <th className="px-4 py-2 text-right">전달 증가율</th>
            <th className="px-4 py-2 text-right">1년 증가율</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((snap, idx) => {
            const prev = idx > 0 ? sorted[idx - 1] : undefined;
            const yearAgo = sorted.find(
              (s) => Number(s.date) === Number(snap.date) - 100,
            );

            const deltaPrev = calcChange(snap, prev);
            const deltaYear = calcChange(snap, yearAgo);

            return (
              <tr key={snap.date} className="border-t">
                <td className="px-4 py-2 whitespace-nowrap">
                  {formatFullDate(snap.date)}
                </td>
                {categories.map((cat) => {
                  const val = getValue(snap, cat);
                  return (
                    <td key={cat} className="px-2 py-1 text-right">
                      ₩{val.toLocaleString()}
                    </td>
                  );
                })}
                <td className="px-4 py-2 text-right font-medium text-foreground">
                  ₩{snap.total.toLocaleString()}
                </td>
                <td
                  className={cn(
                    'px-4 py-2 text-right',
                    deltaPrev?.includes('+') && 'text-green-600',
                    deltaPrev?.includes('-') && 'text-red-600',
                  )}
                >
                  {deltaPrev ?? '—'}
                </td>
                <td
                  className={cn(
                    'px-4 py-2 text-right',
                    deltaYear?.includes('+') && 'text-green-600',
                    deltaYear?.includes('-') && 'text-red-600',
                  )}
                >
                  {deltaYear ?? '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
