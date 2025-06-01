import type { Snapshot } from '@/types/report';
import { formatFullDate } from '@/utils/dateUtils';
import { ASSET_SNAP_CATEGORIES } from '@/types/asset';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    <div className="overflow-auto rounded-md border">
      <Table className="text-sm">
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead className="whitespace-nowrap px-4 py-2">날짜</TableHead>
            {categories.map((cat) => (
              <TableHead key={cat} className="text-right px-2 py-2">
                {cat}
              </TableHead>
            ))}
            <TableHead className="text-right px-4 py-2">합계</TableHead>
            <TableHead className="text-right px-4 py-2">전월 증가율</TableHead>
            <TableHead className="text-right px-4 py-2">1년 증가율</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((snap, idx) => {
            const prev = idx > 0 ? sorted[idx - 1] : undefined;
            const yearAgo = sorted.find(
              (s) => Number(s.date) === Number(snap.date) - 100,
            );

            const deltaPrev = calcChange(snap, prev);
            const deltaYear = calcChange(snap, yearAgo);

            return (
              <TableRow key={snap.date}>
                <TableCell className="whitespace-nowrap px-4 py-2">
                  {formatFullDate(snap.date)}
                </TableCell>
                {categories.map((cat) => {
                  const val = getValue(snap, cat);
                  return (
                    <TableCell key={cat} className="text-right px-2 py-1">
                      ₩{val.toLocaleString()}
                    </TableCell>
                  );
                })}
                <TableCell className="text-right font-medium text-foreground px-4 py-2">
                  ₩{snap.total.toLocaleString()}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right px-4 py-2',
                    deltaPrev?.includes('+') && 'text-green-600',
                    deltaPrev?.includes('-') && 'text-red-600',
                  )}
                >
                  {deltaPrev ?? '—'}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right px-4 py-2',
                    deltaYear?.includes('+') && 'text-green-600',
                    deltaYear?.includes('-') && 'text-red-600',
                  )}
                >
                  {deltaYear ?? '—'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
