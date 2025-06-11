// src/hooks/template/useSaveTemplateMeta.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import type { TemplateMeta } from '@/store/template/templateAtom';

/**
 * 💾 템플릿의 목표 금액, 저축률, 자산 분배를 Firestore에 저장하는 훅
 * - merge: true 옵션으로 다른 필드는 유지
 */
export const useSaveTemplateMeta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Pick<
        TemplateMeta,
        'savingsGoal' | 'savingRate' | 'targetAllocation'
      >,
    ) => {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('로그인이 필요합니다.');

      const ref = doc(db, 'users', uid, 'assetTemplates', 'default');
      await setDoc(ref, data, { merge: true }); // ✅ 부분 필드만 병합 저장
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template'] }); // ✅ 템플릿 refetch
    },
  });
};
