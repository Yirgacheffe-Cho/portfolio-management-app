import { TickerSearchInput } from '@/components/stock/TickerSearchInput';
import { useState } from 'react';
import { type TickerItem } from '@/types/stock';
import { AIInsightCard } from '@/components/common/AIInsightCard';
import { useGeminiStockInsight } from '@/hooks/stock/useGeminiStockInsight';

function StockPage() {
  const [selected, setSelected] = useState<TickerItem | null>(null);
  const { mutateAsync } = useGeminiStockInsight();

  const handleAnalyze = async () => {
    if (!selected) return '❌ 종목이 선택되지 않았습니다.';
    return await mutateAsync(selected);
  };

  return (
    <div className="p-4 space-y-4 max-w-full mx-auto">
      <h2 className="text-xl font-semibold">📈 티커 검색 & 분석</h2>

      <TickerSearchInput onSelect={setSelected} />

      {selected && (
        <div className="text-sm text-muted-foreground">
          선택된 종목: <strong>{selected.name}</strong> ({selected.symbol})
        </div>
      )}

      <AIInsightCard
        title={`${selected?.name || '종목'} 정보`}
        onAnalyze={handleAnalyze}
        disabled={!selected}
      />
    </div>
  );
}

export default StockPage;
