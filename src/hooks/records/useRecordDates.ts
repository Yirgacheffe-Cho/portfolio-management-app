import { useQuery } from '@tanstack/react-query';
import { getAllRecordDates } from '@/services/recordService';

/**
 * 📅 기록 가능한 날짜 목록 조회 훅
 * - 드롭다운 등에서 사용됨
 */
export function useRecordDates() {
  return useQuery({
    queryKey: ['record-dates'],
    queryFn: getAllRecordDates,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
}
