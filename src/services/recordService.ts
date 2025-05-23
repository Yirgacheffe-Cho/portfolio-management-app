import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { AssetRecord } from '@/types/asset';

/**
 * 📘 특정 일자 기록 조회
 * - /records/{yyyymmdd} 문서 가져오기
 */
export async function getRecordFromFirestore(date: string): Promise<{
  savingsGoal: number;
  savingRate: number;
  targetAllocation: Record<string, number>;
  investments: Record<string, AssetRecord[]>;
} | null> {
  const ref = doc(db, 'records', date);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as any) : null;
}

/**
 * 📅 Firestore에 저장된 모든 기록 날짜 조회
 * - /records 컬렉션의 문서 ID만 가져옴
 */
export async function getAllRecordDates(): Promise<string[]> {
  const snapshot = await getDocs(collection(db, 'records'));
  const dates = snapshot.docs.map((doc) => doc.id);
  dates.sort((a, b) => b.localeCompare(a)); // 최신순
  return dates;
}
