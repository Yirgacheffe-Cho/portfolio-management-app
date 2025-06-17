// components/stock/StockChatPanel.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import { useChatSession } from '@/hooks/chat/useChatSession';
import { MessageBubble } from '@/components/chat/MessageBubble';

export function StockChatPanel() {
  const [input, setInput] = useState('');
  const { messageAtoms, sendUserMessage, appendAssistantMessage } =
    useChatSession();

  const handleSend = async () => {
    if (!input.trim()) return;
    sendUserMessage(input);

    // mock 응답 (향후 Gemini 연동)
    const reply = `📈 "${input}"에 대한 분석 결과는 긍정적입니다.`;
    appendAssistantMessage(reply);
    setInput('');
  };

  return (
    <div className="border rounded-xl p-4 bg-muted mt-4">
      <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5" />
        리포트 기반 Q&A
      </h3>

      <ScrollArea className="h-[300px] border bg-background rounded-md p-3 mb-3">
        {messageAtoms.map((atom, idx) => (
          <MessageBubble key={idx} messageAtom={atom} />
        ))}
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
