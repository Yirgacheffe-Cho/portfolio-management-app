// hooks/chat/useChatSession.ts
import { useAtom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import { chatMessagesAtom, type ChatMessage } from '@/store/chat/chatAtoms';

/**
 * 채팅 세션 훅
 * 메시지 상태는 배열로 관리하며, 사용자/AI 메시지를 추가하거나 초기화할 수 있다.
 */
export function useChatSession() {
  const [messages, setMessages] = useAtom(chatMessagesAtom);

  /**
   * 사용자 메시지 추가
   * @param content 입력된 텍스트
   */
  const sendUserMessage = (content: string) => {
    const id = uuidv4();
    const newMessage: ChatMessage = {
      id,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  /**
   * AI 응답 메시지 추가
   * @param content 생성된 응답 텍스트
   */
  const appendAssistantMessage = (content: string) => {
    const id = uuidv4();
    const newMessage: ChatMessage = {
      id,
      role: 'assistant',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  /**
   * 전체 메시지 초기화
   */
  const clearMessages = () => setMessages([]);

  return {
    messages,
    sendUserMessage,
    appendAssistantMessage,
    clearMessages,
  };
}
