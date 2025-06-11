import { useParams } from 'react-router-dom';
import { useRecordPageInit } from '@/hooks/records/useRecordPageInit';
import { RecordPageHeader } from '@/components/records/RecordPageHeader';
import { RecordTabView } from '@/components/records/RecordTabView';

/**
 * 📄 RecordsPage (React Router 기준)
 * - URL param에서 날짜 추출 → 상태 초기화
 */
function RecordsPage() {
  const { date } = useParams(); // ✅ '/records/:date'

  useRecordPageInit(date);

  return (
    <div className="p-4 space-y-4">
      <RecordPageHeader />
      <RecordTabView />
    </div>
  );
}
export default RecordsPage;
