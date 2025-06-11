import { type TickerItem } from '@/types/stock';

export async function searchUsTicker(query: string): Promise<TickerItem[]> {
  if (!query || query.length < 2) return [];

  const res = await fetch(
    `https://vercel-api-yirgacheffe-chos-projects.vercel.app/api/us-search-ticker?q=${encodeURIComponent(query)}`,
  );

  if (!res.ok) {
    console.error('❌ 미국 종목 검색 실패:', res.status);
    return [];
  }

  const data = await res.json();

  // ✅ 점(.) 없는 심볼만 → 미국 본장 (TSLA 등)
  const filtered = data.filter((item: any) => !item.symbol.includes('.'));

  return filtered.map((item: any) => ({
    symbol: item.symbol,
    name: item.name,
    country: 'US',
  }));
}
