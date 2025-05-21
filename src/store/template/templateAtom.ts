// store/template/templateAtom.ts

import { atom } from 'jotai';
import { AssetType } from '@/types/asset';

/**
 * 🔢 사용자 템플릿 전체 구조
 * - Firestore의 assetTemplates/default 문서를 그대로 반영
 */
export interface TemplateMeta {
  savingsGoal: number;
  savingRate: number; // 0.75 (비율 단위)
  targetAllocation: Record<AssetType, number>; // '금': 0.05, ...
  locations?: string[]; // ex) ["우리은행", "토스", ...]
  investments?: Record<
    string, // ex) "우리은행"
    {
      type: AssetType; // 자산 유형 식별용 정수
      currency: string; // 예: "KRW", "USD", "BTC"
    }
  >;
}

export const templateAtom = atom<TemplateMeta | null>(null);
