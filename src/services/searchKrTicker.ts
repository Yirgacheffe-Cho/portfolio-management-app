import { type TickerItem } from '@/types/stock';

export async function searchKrTicker(query: string): Promise<TickerItem[]> {
  if (!query || query.length < 2) return [];

  const res = await fetch(
    `https://vercel-api-yirgacheffe-chos-projects.vercel.app/api/krx-search?q=${encodeURIComponent(query)}`,
  );
  if (!res.ok) {
    console.error('❌ 한국 종목 검색 실패:', res.status);
    return [];
  }

  const data = await res.json();
  return data.map((item: any) => ({
    symbol: item.Symbol,
    name: item.Name,
    country: 'KR',
  }));
}
