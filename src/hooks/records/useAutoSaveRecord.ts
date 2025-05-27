import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import {
  selectedDateAtom,
  recordMetaAtom,
  recordInvestmentsAtom,
} from '@/store/records/recordAtoms';
import type { Snapshot } from '@/types/report';

import { useDebounce } from '@/hooks/common/useDebounce';
import { useMutation } from '@tanstack/react-query';
import { saveRecordToFirestore } from '@/services/recordService';
import { getSnapPieDataFromMeta } from '@/utils/getSnapPieData';
import { saveSnapshotToFirestore } from '@/services/reportSerivce';

export function useAutoSaveRecord() {
  const date = useAtomValue(selectedDateAtom);
  const meta = useAtomValue(recordMetaAtom);
  const investments = useAtomValue(recordInvestmentsAtom);

  const debouncedInvestments = useDebounce(investments, 2000);

  const mutation = useMutation({
    mutationFn: async () => {
      // 🔹 1. 기록 저장
      await saveRecordToFirestore(date, {
        ...meta,
        investments: debouncedInvestments,
      });

      // 🔹 2. 스냅샷 저장 (환율이 있어야만)
      if (meta.exchangeRate && Object.keys(meta.exchangeRate).length > 0) {
        const data = getSnapPieDataFromMeta(debouncedInvestments, meta);
        const total = data.reduce((sum, d) => sum + d.value, 0);
        const snapshot: Snapshot = {
          date,
          total,
          data: getSnapPieDataFromMeta(debouncedInvestments, meta),
          createdAt: Date.now(),
        };

        await saveSnapshotToFirestore(snapshot);
      }
    },
  });

  const mounted = useRef(false);

  useEffect(() => {
    if (!date) return;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    mutation.mutate();
  }, [debouncedInvestments, date]);

  return {
    isSaving: mutation.status === 'pending',
  };
}
