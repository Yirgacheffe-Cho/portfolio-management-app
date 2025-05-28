import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SnapshotTable } from './SnapshotTable.tsx';
import type { Snapshot } from '@/types/report';

type Props = {
  snapshots: Snapshot[];
};

export function SnapshotTableCard({ snapshots }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          📋 자산 총합 추이 (Snapshot List)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[420px] overflow-y-auto overflow-x-auto border rounded-md">
          <SnapshotTable snapshots={snapshots} />
        </div>
      </CardContent>
    </Card>
  );
}
