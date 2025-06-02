import { useDebouncedAction } from '@hooks/common/useDebouncedAction';
import { saveRecordToFirestore } from '@/services/recordService';
import { saveSnapshotToFirestore } from '@/services/reportSerivce';
import { getSnapPieDataFromMeta } from '@/utils/getSnapPieData';
import { useLogger } from '@/utils/logger';
import { useState } from 'react';

import type { InvestmentMap } from '@/types/asset';
import type { RecordMeta } from '@/types/record';

/**
 * 💾 useAutoSaveRecord (in-place 버전)
 *
 * - 외부에서 넘겨받은 investments/meta/date를 기준으로 저장
 * - jotai 상태 변경 없음
 */
export function useAutoSaveRecord(
  investments: InvestmentMap,
  meta: RecordMeta,
  date: string,
) {
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
    } catch (err) {
      log.error('❌ 저장 실패', err);
    } finally {
      setIsSaving(false);
    }
  }, 1000); // 1초 디바운스

  return { trigger, isSaving };
}
