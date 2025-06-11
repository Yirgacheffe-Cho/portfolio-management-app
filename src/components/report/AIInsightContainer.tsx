import { useState, useTransition } from 'react';
import { useGeminiInsight } from '@/hooks/report/useGeminiInsight';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAtomValue } from 'jotai';
import { templateAtom } from '@/store/template/templateAtom';
import { generatePromptFromSnapshots } from '@/utils/generatePromptFromSnapshot';
import { AIReportCard } from '@/components/report/AIReportCard';
import { BrainCircuit } from 'lucide-react';

import type { Snapshot } from '@/types/report';
import { cn } from '@/lib/utils'; // shadcn 기본 유틸 (clsx 래퍼)

type Props = {
  snapshots: Snapshot[];
};

export function AIInsightContainer({ snapshots }: Props) {
  const [result, setResult] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [isPendingTransition, startTransition] = useTransition(); // 🌀 React Concurrent

  const { mutate, isPending } = useGeminiInsight();
  const template = useAtomValue(templateAtom);

  const handleAnalyze = () => {
    if (!template) {
      throw new Error('templateAtom이 null입니다.');
    }

    const prompt = generatePromptFromSnapshots(
      snapshots,
      template.targetAllocation,
    );

    mutate(prompt, {
      onSuccess: (data) => {
        // ✨ UI 업데이트는 transition 안에서 부드럽게 처리
        startTransition(() => {
          setResult(data);
          setAnalyzed(true);
        });
      },
    });
  };

  const showSpinner = isPending || isPendingTransition;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-muted-foreground" />
          AI 분석 리포트
        </CardTitle>
        <Button onClick={handleAnalyze} disabled={showSpinner || analyzed}>
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
          'overflow-hidden px-4 transition-all duration-300',
          result ? 'h-[600px]' : 'min-h-[160px] py-10',
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
