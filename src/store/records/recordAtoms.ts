// src/store/records/recordAtoms.ts
import { atom } from 'jotai';
import type { AssetRecord } from '@/types/asset';
import type { RecordMeta } from '@/types/record';

/**
 * 📆 현재 선택된 일자 기록 (yyyymmdd)
 */
export const selectedDateAtom = atom<string>(''); // 예: '20240523'

/**
 * 📥 일자별 자산 입력 상태
 */
export const recordInvestmentsAtom = atom<Record<string, AssetRecord[]>>({});

/**
 * 🧾 일자별 자산 메타 정보 (목표저축 등)
 */
export const recordMetaAtom = atom<RecordMeta>({
  savingsGoal: 0,
  savingRate: 0,
  targetAllocation: {},
});
