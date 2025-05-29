import { useSetAtom } from 'jotai';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { authAtom } from '@/store/auth/authAtom';
import { templateAtom } from '@/store/template/templateAtom';
import { defaultTemplate } from '@/store/template/defaultTemplate';
import type { TemplateMeta } from '@/store/template/templateAtom';
import { auth, db } from '@/services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';

export const useTemplateInitializer = () => {
  const setTemplate = useSetAtom(templateAtom);
  const user = useAtomValue(authAtom); // ✅ auth.currentUser 대신
  const uid = user?.uid;

  const fetchTemplate = async (): Promise<TemplateMeta | null> => {
    if (!uid) return null;

    const ref = doc(db, 'users', uid, 'assetTemplates', 'default');
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as TemplateMeta) : null;
  };

  const { data } = useSuspenseQuery<TemplateMeta | null, Error>({
    queryKey: ['template', uid],
    queryFn: fetchTemplate,
    staleTime: 1000 * 60 * 10,
  });

  // ✅ 렌더링 타이밍이 아닌, 실제 마운트 이후로 상태 업데이트 defer
  useEffect(() => {
    console.log(JSON.stringify(data));
    setTemplate(data ?? defaultTemplate);
  }, [data, setTemplate]);
};
