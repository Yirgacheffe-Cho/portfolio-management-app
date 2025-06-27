// store/chat/chatAtoms.ts
import { atom } from 'jotai';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export const chatMessagesAtom = atom<ChatMessage[]>([]);

export const getTypingIndicatorMessage = (): ChatMessage => ({
  id: '__typing__',
  role: 'assistant',
  content: '...',
  createdAt: new Date().toISOString(),
});
