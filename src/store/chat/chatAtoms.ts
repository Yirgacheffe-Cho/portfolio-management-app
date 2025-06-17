// store/chat/chatAtoms.ts
import { atom } from 'jotai';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

// 개별 메시지를 감싸는 atom들의 배열
export const chatMessageAtomsAtom = atom<
  ReturnType<typeof atom<ChatMessage>>[]
>([]);
