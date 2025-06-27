// components/ai/AIInsightCard.tsx

import { useEffect, useTransition, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedTickerAtom } from '@/store/stock/selectedTickerAtom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIReportCard } from '@/components/report/AIReportCard';
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  aiInsightResultAtom,
  isAIAnalyzedAtom,
} from '@/store/stock/aiInsightAtom';

type Props = {
  title: string;
  onAnalyze: () => Promise<string>;
  disabled?: boolean;
  resetOnDisabledChange?: boolean;
};

export function AIInsightCard({
  title,
  onAnalyze,
  disabled,
  resetOnDisabledChange,
}: Props) {
  const result = useAtomValue(aiInsightResultAtom); // 읽기 전용 분석 결과
  const analyzed = useAtomValue(isAIAnalyzedAtom); // 분석 완료 여부
  const setResult = useSetAtom(aiInsightResultAtom); // 분석 결과 갱신용 setter
  const selected = useAtomValue(selectedTickerAtom);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (resetOnDisabledChange) setResult('');
  }, [disabled, resetOnDisabledChange, setResult]);
  // ✅ 종목이 바뀌면 분석 상태 리셋
  useEffect(() => {
    setIsAnalyzed(false);
  }, [selected?.symbol]);
  const handleClick = () => {
    startTransition(async () => {
      setIsAnalyzed(false);
      setResult('');
      const res = await onAnalyze();
      setResult(res);
      setIsAnalyzed(true);
    });
  };

  const showSpinner = isPending;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-muted-foreground" />
          {title}
        </CardTitle>
        <Button
          onClick={handleClick}
          disabled={disabled || showSpinner || isAnalyzed}
        >
          {showSpinner ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-muted border-t-transparent rounded-full" />
              분석 중...
            </span>
          ) : isAnalyzed ? (
            '분석 완료'
          ) : (
            '분석하기'
          )}
        </Button>
      </CardHeader>
      <CardContent
        className={cn(
          'px-4 transition-all duration-300',
          analyzed ? 'h-[400px]' : 'min-h-[150px] py-10',
        )}
      >
        {showSpinner ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin h-6 w-6 border-2 border-muted border-t-transparent rounded-full" />
              <p>Gemini가 분석 중입니다...</p>
            </div>
          </div>
        ) : (
          <AIReportCard result={result} />
        )}
      </CardContent>
    </Card>
  );
}
