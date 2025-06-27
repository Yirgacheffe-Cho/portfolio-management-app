import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { aiInsightResultAtom } from '@/store/stock/aiInsightAtom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import { useChatSession } from '@/hooks/chat/useChatSession';
import { useGeminiWithHistory } from '@/hooks/chat/useGeminiWithHistory';
import { getTypingIndicatorMessage } from '@/store/chat/chatAtoms';
import { ChatInput } from './ChatInput';
import { ChatList } from './ChatList';

export function StockChatPanel() {
  const insight = useAtomValue(aiInsightResultAtom); // ✅ 분석 결과 감지
  const { messages, sendUserMessage, appendAssistantMessage, clearMessages } =
    useChatSession();

  const [lastRequestedId, setLastRequestedId] = useState<string | null>(null);

  const { mutate: runGemini, isPending } = useGeminiWithHistory({
    onSuccess: (response) => {
      appendAssistantMessage(response);
    },
  });

  // ✅ 인사이트 분석 결과가 바뀌면 채팅 초기화
  useEffect(() => {
    if (insight) {
      clearMessages();
      setLastRequestedId(null);
    }
  }, [insight]);

  useEffect(() => {
    const last = messages.at(-1);
    if (!last || last.role !== 'user') return;
    if (lastRequestedId === last.id) return;

    setLastRequestedId(last.id);
    runGemini(messages);
  }, [messages]);

  const combinedMessages = isPending
    ? [...messages, getTypingIndicatorMessage()]
    : messages;

  return (
    <div className="border rounded-xl p-4 bg-muted mt-4 flex flex-col gap-3">
      <h3 className="text-base font-semibold flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        리포트 기반 Q&A
      </h3>

      <ScrollArea className="h-[300px] border bg-background rounded-md p-3">
        <ChatList messages={combinedMessages} />
      </ScrollArea>

      <ChatInput onSubmit={sendUserMessage} disabled={isPending} />
    </div>
  );
}
