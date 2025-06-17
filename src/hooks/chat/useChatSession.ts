// hooks/chat/useChatSession.ts
import { useAtom } from 'jotai';
import { atom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import { chatMessageAtomsAtom, type ChatMessage } from '@/store/chat/chatAtoms';

export function useChatSession() {
  const [messageAtoms, setMessageAtoms] = useAtom(chatMessageAtomsAtom);

  const sendUserMessage = (content: string) => {
    const newAtom = atom<ChatMessage>({
      id: uuidv4(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    });
    setMessageAtoms((prev) => [...prev, newAtom]);
  };

  const appendAssistantMessage = (content: string) => {
    const newAtom = atom<ChatMessage>({
      id: uuidv4(),
      role: 'assistant',
      content,
      createdAt: new Date().toISOString(),
    });
    setMessageAtoms((prev) => [...prev, newAtom]);
  };

  const clearMessages = () => setMessageAtoms([]);

  return {
    messageAtoms,
    sendUserMessage,
    appendAssistantMessage,
    clearMessages,
  };
}
