import { useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  selectedDateAtom,
  recordMetaAtom,
  recordInvestmentsAtom,
} from '@/store/records/recordAtoms';

import { getSnapPieDataFromMeta } from '@/utils/getSnapPieData';
import { saveRecordToFirestore } from '@/services/recordService';
import { saveSnapshotToFirestore } from '@/services/reportSerivce';

import { useDebouncedAction } from '@hooks/common/useDebouncedAction'; // ✅ 범용 훅
import { useLogger } from '@/utils/logger';

export function useAutoSaveRecord() {
  const date = useAtomValue(selectedDateAtom);
  const meta = useAtomValue(recordMetaAtom);
  const investments = useAtomValue(recordInvestmentsAtom);
  const log = useLogger(import.meta.url);
  const [isSaving, setIsSaving] = useState(false);

  const trigger = useDebouncedAction(async () => {
    if (!date) return;

    setIsSaving(true);
    try {
      log.debug('💾 자동 저장 시작', { date, meta, investments });

      await saveRecordToFirestore(date, { ...meta, investments });

      if (meta.exchangeRate && Object.keys(meta.exchangeRate).length > 0) {
        const data = getSnapPieDataFromMeta(investments, meta);
        const total = data.reduce((sum, d) => sum + d.value, 0);
        await saveSnapshotToFirestore({
          date,
          total,
          data,
          createdAt: Date.now(),
        });
      }

      log.debug('✅ 자동 저장 완료');
    } finally {
      setIsSaving(false);
    }
  }, 2000);

  return { trigger, isSaving };
}
