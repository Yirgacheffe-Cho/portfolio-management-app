// pages/StockPage.tsx
import { useState, useCallback } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { selectedTickerAtom } from '@/store/stock/selectedTickerAtom';
import { useGeminiStockInsight } from '@/hooks/stock/useGeminiStockInsight';
import { TickerSearchInput } from '@/components/stock/TickerSearchInput';
import { StockAITab } from '@/components/stock/StockAITab';
import { ManualPromptCard } from '@/components/stock/ManualPromptCard';
import { PerplexityResultCard } from '@/components/stock/PerplexityResultCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function StockPage() {
  const selected = useAtomValue(selectedTickerAtom);
  const setSelected = useSetAtom(selectedTickerAtom);
  const { mutateAsync } = useGeminiStockInsight();
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');

  const handleAnalyze = useCallback(async () => {
    if (!selected) return '❌ 종목이 선택되지 않았습니다.';
    return await mutateAsync(selected);
  }, [selected, mutateAsync]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">📈 티커 검색 & 분석</h2>

      <TickerSearchInput onSelect={setSelected} />

      {selected ? (
        <div className="text-sm text-muted-foreground">
          선택된 종목: <strong>{selected.name}</strong> ({selected.symbol})
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">&nbsp;</div>
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

        <StockAITab handleAnalyze={handleAnalyze} />

        <TabsContent value="manual">
          <ManualPromptCard />
          <PerplexityResultCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StockPage;
