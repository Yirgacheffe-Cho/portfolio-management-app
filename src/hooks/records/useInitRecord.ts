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
import { templateAtom } from '@/store/template/templateAtom';
import { useQuery } from '@tanstack/react-query';
import { getRecordFromFirestore } from '@/services/recordService';

export function useInitRecord() {
  // 📌 현재 선택된 날짜 상태 가져오기
  const date = useAtomValue(selectedDateAtom);

  // 📌 상태 setters
  const setMeta = useSetAtom(recordMetaAtom);
  const setInvestments = useSetAtom(recordInvestmentsAtom);

  // 📌 사용자 템플릿 (기록 없을 경우 fallback용)
  const template = useAtomValue(templateAtom);

  // 📡 Firestore에서 기록 fetch (date 변경되면 자동 재요청됨)
  const { data } = useQuery({
    queryKey: ['record', date], // 🔁 date 변경되면 자동 재요청
    queryFn: () => getRecordFromFirestore(date),
    enabled: !!date, // ⚠ 빈 날짜일 땐 실행 방지
  });

  useEffect(() => {
    if (!date) return;

    if (data) {
      // ✅ 기록이 존재할 경우 → 상태 반영
      setMeta({
        savingsGoal: data.savingsGoal,
        savingRate: data.savingRate,
        targetAllocation: data.targetAllocation,
      });
      setInvestments(data.investments);
    } else if (template) {
      // ❌ 기록 없음 → 템플릿 기반 초기값 설정
      setMeta({
        savingsGoal: template.savingsGoal,
        savingRate: template.savingRate,
        targetAllocation: template.targetAllocation,
      });
      setInvestments(template.investments ?? {});
    }
  }, [data, date, setMeta, setInvestments, template]);
}
