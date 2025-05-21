import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';

export const useTemplateQuery = () => {
  return useQuery({
    queryKey: ['template'],
    queryFn: async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('로그인이 필요합니다.');

      const ref = doc(db, 'users', uid, 'assetTemplates', 'default');
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    },
    enabled: !!auth.currentUser, // 로그인 이후만 작동
  });
};
