/**
 * 📥 useInitRecord
 *
 * 선택된 날짜(selectedDateAtom)를 기반으로 자산 기록 상태 초기화
 *
 * ✅ FLOW:
 * 1. selectedDateAtom에서 현재 선택된 날짜 가져옴
 * 2. 해당 날짜의 기록을 Firestore에서 fetch (queryKey: ['record', date])
 * 3. 기록이 있으면 → recordMetaAtom + recordInvestmentsAtom에 반영
 * 4. 기록이 없으면 → templateAtom 기반으로 상태 초기화 (Firestore에는 아직 저장 X)
 * 5. 날짜가 변경되면 자동으로 위 로직 재실행됨
 */
import { useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import {
  recordMetaAtom,
  recordInvestmentsAtom,
  selectedDateAtom,
} from '@/store/records/recordAtoms';
import { useQuery } from '@tanstack/react-query';
import { getRecordFromFirestore } from '@/services/recordService';
import { useLogger } from '@/utils/logger';

export function useInitRecord() {
  // 📌 현재 선택된 날짜 상태 가져오기
  const date = useAtomValue(selectedDateAtom);
  const log = useLogger(import.meta.url);
  // 📌 상태 setters
  const setMeta = useSetAtom(recordMetaAtom);
  const setInvestments = useSetAtom(recordInvestmentsAtom);

  // 📡 Firestore에서 기록 fetch (date 변경되면 자동 재요청됨)
  const { data } = useQuery({
    queryKey: ['record', date], // 🔁 date 변경되면 자동 재요청
    queryFn: () => getRecordFromFirestore(date),
    enabled: !!date, // ⚠ 빈 날짜일 땐 실행 방지
  });

  useEffect(() => {
    if (data) {
      // ✅ 기록이 존재할 경우 → 상태 반영
      log.info(`📘 기록 불러오기 완료: ${date}`);
      setMeta({
        savingsGoal: data.savingsGoal,
        savingRate: data.savingRate,
        targetAllocation: data.targetAllocation,
        exchangeRate: data.exchangeRate,
      });
      setInvestments(data.investments);
    } else {
      log.warn(`❗ 기록도 템플릿도 없음 → 초기화 실패: ${date}`);
    }
  }, [data]);
}
