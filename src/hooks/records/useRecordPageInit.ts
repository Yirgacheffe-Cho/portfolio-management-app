// hooks/records/useRecordPageInit.ts
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { selectedDateAtom } from '@/store/records/recordAtoms';
import { useInitRecord } from './useInitRecord';

/**
 * 📅 useRecordPageInit
 * - URL에서 전달된 date 파라미터를 selectedDateAtom에 설정
 * - 언마운트 시 selectedDateAtom 초기화
 * - 해당 date에 따른 기록 상태도 자동 fetch & 초기화
 */
export function useRecordPageInit(date: string | undefined) {
  const setDate = useSetAtom(selectedDateAtom);

  useEffect(() => {
    if (date) {
      setDate(date);
    }

    return () => {
      setDate(''); // 🔁 언마운트 시 초기화 (or null)
    };
  }, [date, setDate]);

  // 🔁 내부에서 selectedDateAtom을 구독하여 상태 초기화
  useInitRecord();
}
