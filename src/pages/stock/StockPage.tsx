// pages/StockPage.tsx
import { TickerSearchInput } from '@/components/stock/TickerSearchInput';
import { useState } from 'react';
import { type TickerItem } from '@/types/stock';
import { AIInsightCard } from '@/components/common/AIInsightCard';
import { useGeminiStockInsight } from '@/hooks/stock/useGeminiStockInsight';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ManualPromptCard } from '@/components/stock/ManualPromptCard';

function StockPage() {
  const [selected, setSelected] = useState<TickerItem | null>(null);
  const { mutateAsync } = useGeminiStockInsight();
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');

  const handleAnalyze = async () => {
    if (!selected) return '❌ 종목이 선택되지 않았습니다.';
    return await mutateAsync(selected);
  };

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">📈 티커 검색 & 분석</h2>

      <TickerSearchInput onSelect={setSelected} />

      {selected && (
        <div className="text-sm text-muted-foreground">
          선택된 종목: <strong>{selected.name}</strong> ({selected.symbol})
        </div>
      )}

      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as 'ai' | 'manual')}
        className="w-full mt-2"
      >
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="ai">✨ 자동 분석 (Gemini)</TabsTrigger>
          <TabsTrigger value="manual">
            ✍️ 수동 프롬프트 (Perplexity)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai">
          <AIInsightCard
            title={`${selected?.name || '종목'} 정보`}
            onAnalyze={handleAnalyze}
            disabled={!selected}
          />
        </TabsContent>

        <TabsContent value="manual">
          <ManualPromptCard selected={selected} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StockPage;
