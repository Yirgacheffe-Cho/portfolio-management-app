import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { AssetRecord, InvestmentMap } from '@/types/asset';
import type { RecordMeta } from '@/types/record';
import { getUserTemplate } from './templateService';
import { fetchExchangeRates, fetchCryptoPrices } from './exchangeService';

/**
 * 📘 특정 일자 기록 조회
 * - 경로: /users/{uid}/records/{yyyymmdd}
 */
export async function getRecordFromFirestore(date: string): Promise<{
  savingsGoal: number;
  savingRate: number;
  targetAllocation: Record<string, number>;
  investments: Record<string, AssetRecord[]>;
  exchangeRate: Record<string, number>;
} | null> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('로그인이 필요합니다.');

  const ref = doc(db, 'users', uid, 'records', date);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as any) : null;
}

/**
 * 📅 Firestore에 저장된 모든 기록 날짜 조회
 * - 경로: /users/{uid}/records
 * - 반환: ['20240501', '20240523', ...]
 */
export async function getAllRecordDates(): Promise<string[]> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('로그인이 필요합니다.');

  const snapshot = await getDocs(collection(db, 'users', uid, 'records'));
  const dates = snapshot.docs.map((doc) => doc.id);
  dates.sort((a, b) => b.localeCompare(a)); // 최신순 정렬
  return dates;
}

/**
 * ➕ 템플릿 기반 자산 기록 생성
 * - 경로: /users/{uid}/records/{yyyymmdd}
 */

export async function createRecordFromTemplate(date: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('로그인이 필요합니다.');

  const template = await getUserTemplate();
  if (!template) throw new Error('템플릿 없음');

  // ✅ 환율 정보 가져오기
  const [usdToKrw, crypto] = await Promise.all([
    fetchExchangeRates(date),
    fetchCryptoPrices(date),
  ]);

  const exchangeRate: Record<string, number> = {
    USD: usdToKrw,
    BTC: crypto.BTC,
    ETH: crypto.ETH,
  };

  const { savingsGoal, savingRate, targetAllocation, investments } = template;

  await setDoc(doc(db, 'users', uid, 'records', date), {
    savingsGoal,
    savingRate,
    targetAllocation,
    investments,
    exchangeRate, // ✅ 함께 저장
  });
}
/**
 * 💾 자산 정보 있는지 확인
 * - 경로: /users/{uid}/records/{yyyymmdd}
 */
export async function checkRecordExists(date: string): Promise<boolean> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('로그인이 필요합니다.');
  const ref = doc(db, 'users', uid, 'records', date);
  const snap = await getDoc(ref);
  return snap.exists();
}
/**
 * 💾 자산 기록 저장 (덮어쓰기)
 * - 경로: /users/{uid}/records/{yyyymmdd}
 */
export async function saveRecordToFirestore(
  date: string,
  data: RecordMeta & { investments: InvestmentMap },
) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('로그인이 필요합니다.');

  const ref = doc(db, 'users', uid, 'records', date);
  await setDoc(ref, data); // 🔄 전체 덮어쓰기
}
