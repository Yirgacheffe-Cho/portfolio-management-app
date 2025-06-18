// hooks/chat/useChatSession.ts
import { useAtom } from 'jotai';
import { atom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import { chatMessageAtomsAtom, type ChatMessage } from '@/store/chat/chatAtoms';

export function useChatSession() {
  const [messageAtoms, setMessageAtoms] = useAtom(chatMessageAtomsAtom);

  const sendUserMessage = (content: string) => {
    const id = uuidv4();
    const msgAtom = atom<ChatMessage>({
      id,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    });
    setMessageAtoms((prev) => [...prev, { id, atom: msgAtom }]);
  };

  const appendAssistantMessage = (content: string) => {
    const id = uuidv4();
    const msgAtom = atom<ChatMessage>({
      id,
      role: 'assistant',
      content,
      createdAt: new Date().toISOString(),
    });
    setMessageAtoms((prev) => [...prev, { id, atom: msgAtom }]);
  };

  const clearMessages = () => setMessageAtoms([]);

  return {
    messageAtoms,
    sendUserMessage,
    appendAssistantMessage,
    clearMessages,
  };
}
