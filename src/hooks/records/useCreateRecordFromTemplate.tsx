// hooks/records/useCreateRecordFromTemplate.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createRecordFromTemplate } from '@/services/recordService';

export const useCreateRecordFromTemplate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dateStr: string) => createRecordFromTemplate(dateStr),
    onSuccess: (_, dateStr) => {
      queryClient.invalidateQueries({ queryKey: ['record-dates'] });
      navigate(`/records/${dateStr}`);
    },
  });
};
