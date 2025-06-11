import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  createRecordFromTemplate,
  checkRecordExists,
} from '@/services/recordService';
import { toast } from 'sonner';
import { useLogger } from '@/utils/logger';

export const useCreateRecordFromTemplate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const log = useLogger(import.meta.url);

  return useMutation({
    mutationFn: async (dateStr: string) => {
      log.debug('자산 기록 생성 시도:', dateStr);

      const exists = await checkRecordExists(dateStr);
      if (exists) {
        log.info('기존 기록 존재:', dateStr);
        return 'EXISTS';
      }

      await createRecordFromTemplate(dateStr);
      log.info('기록 생성 완료:', dateStr);

      return 'CREATED';
    },
    onSuccess: (status, dateStr) => {
      if (status === 'CREATED') {
        queryClient.invalidateQueries({ queryKey: ['record-dates'] }); // 🔁 날짜 목록 캐시 무효화
        toast.success('자산 입력이 생성되었습니다.');
        log.debug('자산 입력 생성 성공 → 이동:', dateStr);
      } else {
        toast.info('이미 해당 날짜의 기록이 존재합니다.', {
          description: '해당 날짜로 이동합니다.',
        });
        log.debug('기록 존재 → 이동만 수행:', dateStr);
      }

      navigate(`/records/${dateStr}`);
    },
    onError: (err, dateStr) => {
      toast.error('자산 입력 생성 중 오류가 발생했습니다.');
      log.error('자산 입력 생성 실패:', dateStr, err);
    },
  });
};
