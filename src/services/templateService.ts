// services/templateService.ts
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import type { TemplateMeta } from '@/store/template/templateAtom';

export const getUserTemplate = async (): Promise<TemplateMeta | null> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('로그인이 필요합니다.');

  const ref = doc(db, 'users', uid, 'assetTemplates', 'default');
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as TemplateMeta) : null;
};
