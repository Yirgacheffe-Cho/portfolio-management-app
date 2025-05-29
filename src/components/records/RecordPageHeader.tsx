import { useAtomValue } from 'jotai';
import { selectedDateAtom } from '@/store/records/recordAtoms';
import { useRecordDates } from '@/hooks/records/useRecordDates';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, PlusIcon, PencilIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRecordFromTemplate } from '@/services/recordService';

export function RecordPageHeader() {
  const selectedDate = useAtomValue(selectedDateAtom);
  const { data: recordDates = [] } = useRecordDates();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  // ✅ 자산 입력 생성 → Firestore 문서 생성 + navigate + 캐시 무효화
  const createMutation = useMutation({
    mutationFn: () => createRecordFromTemplate(today),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['record-dates'],
      });
      navigate(`/records/${today}`);
    },
  });

  return (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      {/* 날짜 선택 드롭다운 */}
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
        <Select
          value={selectedDate}
          onValueChange={(value) => navigate(`/records/${value}`)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="날짜 선택" />
          </SelectTrigger>
          <SelectContent>
            {recordDates.map((date) => (
              <SelectItem key={date} value={date}>
                {formatDate(date)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => createMutation.mutate()}
          disabled={createMutation.status === 'pending'} // ✅ 이렇게 변경
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          자산 입력 생성
        </Button>

        <Button variant="secondary" size="sm" disabled>
          <PencilIcon className="w-4 h-4 mr-1" />
          구성 편집
        </Button>
      </div>
    </div>
  );
}

// ✅ 날짜 포맷 함수 (예: 20240523 → 2024년 05월 23일)
function formatDate(dateStr: string) {
  const yyyy = dateStr.slice(0, 4);
  const mm = dateStr.slice(4, 6);
  const dd = dateStr.slice(6, 8);
  return `${yyyy}년 ${mm}월 ${dd}일`;
}
