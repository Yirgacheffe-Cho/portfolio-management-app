// hooks/useGeminiStockInsight.ts
import { useMutation } from '@tanstack/react-query';
import { fetchGeminiStockInfo } from '@/services/geminiService';
import { type TickerItem } from '@/types/stock';

/**
 * 📈 Gemini를 통한 종목 분석 훅
 * - TickerItem을 기반으로 분석 요청
 * - React Query useMutation 패턴
 */
export function useGeminiStockInsight() {
  return useMutation({
    mutationFn: (stockInfo: TickerItem) => fetchGeminiStockInfo(stockInfo),
  });
}
