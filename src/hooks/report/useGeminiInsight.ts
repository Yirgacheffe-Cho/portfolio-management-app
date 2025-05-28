import { useMutation } from '@tanstack/react-query';
import { fetchGeminiInsight } from '@/services/geminiService';

export function useGeminiInsight() {
  return useMutation({
    mutationFn: (prompt: string) => fetchGeminiInsight(prompt),
  });
}
