import { atom } from 'jotai';
import type { User } from 'firebase/auth';

// null: 로딩 중, undefined: 로그아웃, User: 로그인됨
export const authAtom = atom<User | null | undefined>(null);
