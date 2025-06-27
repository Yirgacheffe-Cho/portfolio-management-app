// components/stock/PerplexityResultCard.tsx

import { useState, useTransition } from 'react';
import { useAtomValue } from 'jotai';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AIReportCard } from '@/components/report/AIReportCard';
import { createFinalPrompt } from '@/utils/createFinalPrompt';
import { useGeminiInsight } from '@/hooks/report/useGeminiInsight';
import { selectedTickerAtom } from '@/store/stock/selectedTickerAtom';

export function PerplexityResultCard() {
  const selected = useAtomValue(selectedTickerAtom);
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [isPending, startTransition] = useTransition();
  const { mutateAsync } = useGeminiInsight();

  const handleAnalyze = async () => {
    if (!selected || !text) return;
    const prompt = createFinalPrompt(text, selected);
    startTransition(async () => {
      const res = await mutateAsync(prompt);
      setResult(res);
    });
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-base">📄 Perplexity 결과 붙여넣기</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          rows={5}
          placeholder="Perplexity에서 복사한 내용을 붙여넣으세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-[100px] overflow-auto resize-none font-mono"
        />
        <Button
          disabled={!text || isPending}
          onClick={handleAnalyze}
          className="w-full"
        >
          {isPending ? 'Gemini 분석 중...' : '📊 Gemini로 분석 리포트 생성'}
        </Button>

        {result && <AIReportCard result={result} />}
      </CardContent>
    </Card>
  );
}
