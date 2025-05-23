import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import type { TemplateMeta } from '@/store/template/templateAtom';
import { templateAtom } from '@/store/template/templateAtom';
import { useSetAtom } from 'jotai';
export const useSaveTemplate = () => {
  const queryClient = useQueryClient();
  const setTemplate = useSetAtom(templateAtom); // ✅ jotai setter

  return useMutation({
    mutationFn: async (data: TemplateMeta) => {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('로그인이 필요합니다.');

      const ref = doc(db, 'users', uid, 'assetTemplates', 'default');
      await setDoc(ref, data, { merge: false }); // 🔥 완전 덮어쓰기
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['template'] });
      //setTemplate(data);
    },
  });
};
