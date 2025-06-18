import { useEffect, useState, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import { useChatSession } from '@/hooks/chat/useChatSession';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { aiInsightResultAtom } from '@/store/stock/aiInsightAtom';

export function StockChatPanel() {
  const [input, setInput] = useState('');
  const { messageAtoms, sendUserMessage, appendAssistantMessage } =
    useChatSession();
  const insight = useAtomValue(aiInsightResultAtom);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  // ✅ 메시지 추가 시 스크롤 맨 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageAtoms.length]);
  // ✅ 최초 분석 결과를 첫 assistant 메시지로 삽입
  useEffect(() => {
    if (messageAtoms.length === 0 && insight) {
      appendAssistantMessage(insight);
    }
  }, [insight, messageAtoms.length, appendAssistantMessage]);
  useEffect(() => {
    console.log('messageAtoms:', messageAtoms);
  }, [messageAtoms]);
  const handleSend = async () => {
    if (!input.trim()) return;
    sendUserMessage(input);
    setInput('');
  };

  return (
    <div className="border rounded-xl p-4 bg-muted mt-4">
      <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5" />
        리포트 기반 Q&A
      </h3>
      <ScrollArea className="h-[300px] border bg-background rounded-md p-3 mb-3">
        {messageAtoms.map(({ id, atom }) => (
          <MessageBubble key={id} messageAtom={atom} />
        ))}
        <div ref={bottomRef} /> {/* ✅ 스크롤 대상 */}
      </ScrollArea>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="예: 이 종목의 목표가 평균은?"
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!input.trim()}>
          전송
        </Button>
      </div>
    </div>
  );
}
