// src/hooks/template/useTemplateInitializer.ts
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { templateAtom } from '@/store/template/templateAtom';
import { defaultTemplate } from '@/store/template/defaultTemplate';
import type { TemplateMeta } from '@/store/template/templateAtom';
import { useQuery } from '@tanstack/react-query';
import { auth, db } from '@/services/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * ✅ 템플릿 데이터를 Firestore에서 불러오고 jotai 전역 상태에 설정하는 훅
 */
export const useTemplateInitializer = () => {
  const setTemplate = useSetAtom(templateAtom);

  // 📌 추후 서비스로 분리하기 쉬운 구조
  const fetchTemplate = async (): Promise<TemplateMeta | null> => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('로그인이 필요합니다.');

    const ref = doc(db, 'users', uid, 'assetTemplates', 'default');
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as TemplateMeta) : null;
  };

  const { data, isFetched } = useQuery({
    queryKey: ['template'],
    queryFn: fetchTemplate,
    enabled: !!auth.currentUser,
  });

  // ✅ 불러온 템플릿을 jotai에 저장 (없으면 기본 템플릿 사용)
  useEffect(() => {
    if (!isFetched) return;
    setTemplate(data ?? defaultTemplate);
  }, [data, isFetched, setTemplate]);
};
