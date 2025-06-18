// store/chat/chatAtoms.ts
import { atom } from 'jotai';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

// 메시지 atom을 id와 함께 관리
export const chatMessageAtomsAtom = atom<
  { id: string; atom: ReturnType<typeof atom<ChatMessage>> }[]
>([]);
