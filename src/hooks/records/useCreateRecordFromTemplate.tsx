import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  createRecordFromTemplate,
  checkRecordExists,
} from '@/services/recordService';
import { toast } from 'sonner';

export const useCreateRecordFromTemplate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (dateStr: string) => {
      const exists = await checkRecordExists(dateStr);
      if (exists) return 'EXISTS';

      await createRecordFromTemplate(dateStr);
      return 'CREATED';
    },
    onSuccess: (status, dateStr) => {
      if (status === 'CREATED') {
        queryClient.invalidateQueries({ queryKey: ['record-dates'] });
        toast.success('자산 입력이 생성되었습니다.');
      } else {
        toast.info('이미 해당 날짜의 기록이 존재합니다.', {
          description: '해당 날짜로 이동합니다.',
        });
      }
      navigate(`/records/${dateStr}`);
    },
    onError: (err) => {
      toast.error('자산 입력 생성 중 오류가 발생했습니다.');
      console.error(err);
    },
  });
};
