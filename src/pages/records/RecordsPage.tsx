import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { selectedDateAtom } from '@/store/records/recordAtoms';
import { useInitRecord } from '@/hooks/records/useInitRecord';
import { RecordPageHeader } from '@/components/records/RecordPageHeader';
import { RecordTabView } from '@/components/records/RecordTabView';

/**
 * 📄 RecordsPage (React Router 기준)
 * - URL param에서 날짜 추출 → 상태 초기화
 */
function RecordsPage() {
  const { date } = useParams(); // ✅ '/records/:date'
  const setDate = useSetAtom(selectedDateAtom);

  useEffect(() => {
    if (typeof date === 'string') {
      setDate(date);
    }
  }, [date, setDate]);

  useInitRecord();

  return (
    <div className="p-4 space-y-4">
      <RecordPageHeader />
      <RecordTabView />
    </div>
  );
}
export default RecordsPage;
