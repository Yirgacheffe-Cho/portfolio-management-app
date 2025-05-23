// store/template/templateAtom.ts

import { atom } from 'jotai';
import type { AssetType } from '@/types/asset';
import type { AssetRecord } from '@/types/asset';

/**
 * 🔢 사용자 템플릿 전체 구조
 * - Firestore의 assetTemplates/default 문서를 그대로 반영
 */
export interface TemplateMeta {
  savingsGoal: number;
  savingRate: number; // 0.75 (비율 단위)
  targetAllocation: Record<AssetType, number>; // '금': 0.05, ...
  //locations?: string[];
  investments?: Record<
    string, // 위치 이름 (ex: "우리은행")
    AssetRecord[]
  >;
}
/**
 * ✅ template.investments 만 별도로 다루는 파생 atom
 */

export const templateInvestmentsAtom = atom(
  (get) => get(templateAtom)?.investments ?? {},
  (get, set, updated: Record<string, AssetRecord[]>) => {
    const prev = get(templateAtom);
    if (prev) {
      set(templateAtom, {
        ...prev,
        investments: updated,
      });
    }
  },
);
export const templateAtom = atom<TemplateMeta | null>(null);
