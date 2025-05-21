import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import type { TemplateMeta } from '@/store/template/templateAtom';

export const useSaveTemplateInvestments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (investments: TemplateMeta['investments']) => {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('로그인이 필요합니다.');

      const ref = doc(db, 'users', uid, 'assetTemplates', 'default');
      await setDoc(ref, { investments }, { merge: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template'] });
    },
  });
};
