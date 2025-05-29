import { useSetAtom } from 'jotai';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { authAtom } from '@/store/auth/authAtom';
import { templateAtom } from '@/store/template/templateAtom';
import { defaultTemplate } from '@/store/template/defaultTemplate';
import type { TemplateMeta } from '@/store/template/templateAtom';
import { db } from '@/services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useLogger } from '@/utils/logger';

export const useTemplateInitializer = () => {
  const setTemplate = useSetAtom(templateAtom);
  const user = useAtomValue(authAtom);
  const log = useLogger(import.meta.url);
  const uid = user?.uid;

  const fetchTemplate = async (): Promise<TemplateMeta> => {
    if (!uid) throw new Error('로그인이 필요합니다.');

    const ref = doc(db, 'users', uid, 'assetTemplates', 'default');
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data() as TemplateMeta;
    } else {
      // ❗템플릿이 없으면 기본 템플릿 생성
      await setDoc(ref, defaultTemplate, { merge: false });
      log.debug('📦 기본 템플릿 저장 완료');
      return defaultTemplate;
    }
  };

  const { data } = useSuspenseQuery<TemplateMeta>({
    queryKey: ['template', uid],
    queryFn: fetchTemplate,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    log.debug('🎯 템플릿 상태 세팅', data);
    setTemplate(data);
  }, [data, setTemplate]);
};
