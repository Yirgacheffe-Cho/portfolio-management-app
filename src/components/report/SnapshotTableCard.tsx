import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SnapshotTable } from './SnapshotTable.tsx';
import type { Snapshot } from '@/types/report';
import { Table } from 'lucide-react';
type Props = {
  snapshots: Snapshot[];
};

export function SnapshotTableCard({ snapshots }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground inline-flex items-center gap-2">
          <Table className="w-4 h-4 text-muted-foreground" />
          자산 추이
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
