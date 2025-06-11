// components/ai/AIInsightCard.tsx

import { useState, useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIReportCard } from '@/components/report/AIReportCard';
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  onAnalyze: () => Promise<string>;
  disabled?: boolean;
};

export function AIInsightCard({ title, onAnalyze, disabled }: Props) {
  const [result, setResult] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [isPendingTransition, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const res = await onAnalyze();
      setResult(res);
      setAnalyzed(true);
    });
  };

  const showSpinner = isPendingTransition;

  const showSkeleton = disabled && !analyzed && !result;

  return (
    <Card className="w-full">
      {' '}
      {/* Card의 width는 w-full로 괜찮습니다. */}
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-muted-foreground" />
          {title}
        </CardTitle>
        <Button
          onClick={handleClick}
          disabled={disabled || showSpinner || analyzed}
        >
          {showSpinner ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-muted border-t-transparent rounded-full" />
              분석 중...
            </span>
          ) : analyzed ? (
            '분석 완료'
          ) : (
            '분석하기'
          )}
        </Button>
      </CardHeader>
      <CardContent
        className={cn(
          'px-4 transition-all duration-300', // 💡 여기에서 'overflow-hidden' 제거!
          result || showSkeleton ? 'h-[400px]' : 'min-h-[150px] py-10',
        )}
      >
        {showSpinner ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin h-6 w-6 border-2 border-muted border-t-transparent rounded-full" />
              <p>Gemini가 분석 중입니다...</p>
            </div>
          </div>
        ) : result ? (
          <AIReportCard result={result} />
        ) : showSkeleton ? (
          <div className="h-full w-full bg-muted/40 animate-pulse rounded-lg" />
        ) : null}
      </CardContent>
    </Card>
  );
}
