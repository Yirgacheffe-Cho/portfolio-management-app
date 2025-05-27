import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import {
  selectedDateAtom,
  recordMetaAtom,
  recordInvestmentsAtom,
} from '@/store/records/recordAtoms';
import { useDebounce } from '@/hooks/common/useDebounce';
import { useMutation } from '@tanstack/react-query';
import { saveRecordToFirestore } from '@/services/recordService';

/**
 * 💾 useAutoSaveRecord
 * - 자산 기록 상태가 변경되면 debounce 후 자동 저장
 */
export function useAutoSaveRecord() {
  const date = useAtomValue(selectedDateAtom);
  const meta = useAtomValue(recordMetaAtom);
  const investments = useAtomValue(recordInvestmentsAtom);

  const debouncedInvestments = useDebounce(investments, 2000);

  const mutation = useMutation({
    mutationFn: () =>
      saveRecordToFirestore(date, {
        ...meta,
        investments: debouncedInvestments,
      }),
  });

  // ✅ 최초 마운트 이후부터만 저장 작동
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
