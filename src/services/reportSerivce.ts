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
export async function getSnapshotsFromFirestore(
  uid: string,
): Promise<Snapshot[]> {
  const colRef = collection(db, 'users', uid, 'reports');
  const snap = await getDocs(colRef);
  return snap.docs
    .map((doc) => doc.data())
    .filter((d): d is Snapshot => !!d.date && !!d.total && !!d.data) // 타입 가드
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}
