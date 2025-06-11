// hooks/useUnifiedTickerSearch.ts
import { useState } from 'react';
import { loadTickers } from '@/utils/tickerCache';
import { searchUsTicker } from '@/services/searchUsTicker';
import { type TickerItem } from '@/types/stock';

// ✅ 한국 종목 원본 데이터 타입
interface KrRawItem {
  Symbol: string;
  Name: string;
  Market: string;
}

export function useUnifiedTickerSearch() {
  const [results, setResults] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    const { fuse } = await loadTickers();
    const krResults = fuse
      .search(query)
      .map((r) => {
        const item = r.item as unknown as KrRawItem;
        return {
          symbol: item.Symbol,
          name: item.Name,
          country: 'KR' as const,
        };
      })
      .slice(0, 10);

    let usResults: TickerItem[] = [];
    if (!/[가-힣]/.test(query)) {
      try {
        usResults = await searchUsTicker(query);
      } catch (err) {
        console.warn('❌ 미국 종목 검색 실패', err);
      }
    }

    setResults([...krResults, ...usResults].slice(0, 20));
    setLoading(false);
  };

  return { results, search, loading };
}
