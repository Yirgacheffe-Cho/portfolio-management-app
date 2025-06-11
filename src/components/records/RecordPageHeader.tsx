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
import { CalendarIcon, PencilIcon } from 'lucide-react';
import { DatePickerWithAction } from '@/components/common/DatePickerWithAction';
import { useCreateRecordFromTemplate } from '@/hooks/records/useCreateRecordFromTemplate';
import { formatFullDate } from '@/utils/dateUtils';

export function RecordPageHeader() {
  const selectedDate = useAtomValue(selectedDateAtom);
  const { data: recordDates = [] } = useRecordDates();
  const navigate = useNavigate();
  const createMutation = useCreateRecordFromTemplate();

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
                {formatFullDate(date)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-2">
        <DatePickerWithAction
          label="자산 입력 생성"
          confirmText="생성하기"
          onConfirm={(date) => {
            createMutation.mutate(date);
          }}
        />

        <Button variant="secondary" size="sm" disabled>
          <PencilIcon className="w-4 h-4 mr-1" />
          구성 편집
        </Button>
      </div>
    </div>
  );
}
