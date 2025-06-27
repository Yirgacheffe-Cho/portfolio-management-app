import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { fetchGeminiWithMessages } from '@/services/geminiService';
import type { ChatMessage } from '@/store/chat/chatAtoms';
import { aiInsightResultAtom } from '@/store/stock/aiInsightAtom'; // Import the atom
import { useAtomValue } from 'jotai'; // Import useAtomValue

export function useGeminiWithHistory(
  options?: UseMutationOptions<string, Error, ChatMessage[]>,
) {
  const insight = useAtomValue(aiInsightResultAtom); // Get insight here

  return useMutation({
    // Modify mutationFn to pass insight as the second argument
    mutationFn: (messages: ChatMessage[]) =>
      fetchGeminiWithMessages(messages, insight),
    ...options,
  });
}

export default useGeminiWithHistory;
