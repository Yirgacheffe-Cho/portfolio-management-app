// store/stock/aiInsightAtom.ts
import { atom } from 'jotai';

// 🔹 분석 결과 텍스트 (Gemini의 분석 요약)
export const aiInsightResultAtom = atom<string>('');

// 🔸 분석이 완료되었는지 여부 (derived atom)
export const isAIAnalyzedAtom = atom((get) => !!get(aiInsightResultAtom));
