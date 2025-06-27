import { useEffect, useRef, memo } from 'react';
import type { ChatMessage } from '@/store/chat/chatAtoms';
import { MessageBubble } from './MessageBubble';

type Props = {
  messages: ChatMessage[];
};

/**
 * 채팅 메시지 리스트
 * props가 바뀌지 않으면 리렌더링 방지
 */
export const ChatList = memo(({ messages }: Props) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastMessageId = messages.at(-1)?.id;

  useEffect(() => {
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50); // DOM 그려진 후 실행
    return () => clearTimeout(timeout);
  }, [lastMessageId]); // ✅ ID 기반 → 추가/수정 모두 반응

  console.log('📦 ChatList 렌더');

  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
});
ChatList.displayName = 'ChatList';
