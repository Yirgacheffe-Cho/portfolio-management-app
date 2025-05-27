// services/snapshotService.ts
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { Snapshot } from '@/types/report';

/**
 * 📦 사용자의 특정 월 스냅샷을 Firestore에 저장
 * @param uid 사용자 UID
 * @param snapshot 스냅샷 데이터 (date는 '202405' 형식)
 * @returns 저장 Promise
 */
export async function saveSnapshotToFirestore(
  snapshot: Snapshot,
): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('로그인이 필요합니다.');
  const ref = doc(db, 'users', uid, 'reports', snapshot.date);
  await setDoc(ref, snapshot, { merge: false }); // merge: true로 변경 보존 가능
}
