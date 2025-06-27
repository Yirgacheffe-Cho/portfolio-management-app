// store/stock/selectedTickerAtom.ts
import { atom } from 'jotai';
import type { TickerItem } from '@/types/stock';

export const selectedTickerAtom = atom<TickerItem | null>(null);
