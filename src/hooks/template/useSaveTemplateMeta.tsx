import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import type { TemplateMeta } from '@/types/template';

export const useSaveTemplateMeta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TemplateMeta) => {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('로그인이 필요합니다.');

      const ref = doc(db, 'users', uid, 'assetTemplates', 'default');
      await setDoc(ref, data, { merge: true }); // ⚠ 기존 investments 등 유지
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template'] });
    },
  });
};
