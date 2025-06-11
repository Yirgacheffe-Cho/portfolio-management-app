// utils/tickerCache.ts
import Fuse from 'fuse.js';
import { type TickerItem } from '@/types/stock';

let fuseInstance: Fuse<TickerItem> | null = null;
let tickers: TickerItem[] = [];

export async function loadTickers() {
  if (fuseInstance) return { fuse: fuseInstance, tickers };

  const res = await fetch(
    'https://vercel-api-yirgacheffe-chos-projects.vercel.app/api/kr-tickers',
  );
  tickers = await res.json();

  fuseInstance = new Fuse(tickers, {
    keys: ['Symbol', 'Name'],
    threshold: 0.3,
  });

  return { fuse: fuseInstance, tickers };
}
