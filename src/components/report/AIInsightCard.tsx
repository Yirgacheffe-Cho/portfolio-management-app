import { useState } from 'react';
import { useGeminiInsight } from '@/hooks/report/useGeminiInsight';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { generatePromptFromSnapshots } from '@/utils/generatePromptFromSnapshot';
import type { Snapshot } from '@/types/report';
import { useAtomValue, useAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { templateAtom } from '@/store/template/templateAtom';
type Props = {
  snapshots: Snapshot[];
};

export function AIInsightCard({ snapshots }: Props) {
  const [result, setResult] = useState('');
  const { mutate, isPending } = useGeminiInsight();
  const template = useAtomValue(templateAtom);

  const handleAnalyze = () => {
    if (!template) {
      throw new Error(
        'templateAtom 값이 null입니다. 로직 상 초기화가 누락된 것 같습니다.',
      );
    }

    const prompt = generatePromptFromSnapshots(
      snapshots,
      template.targetAllocation,
    );

    mutate(prompt, {
      onSuccess: (data) => {
        console.log('✨ 분석 결과', data);
        setResult(data); // 또는 상태로 저장해서 화면에 보여주기
      },
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>🧠 AI 분석 리포트</CardTitle>
        <Button onClick={handleAnalyze} disabled={isPending}>
          {isPending ? '분석 중...' : '분석하기'}
        </Button>
      </CardHeader>
      <CardContent className="whitespace-pre-wrap text-sm text-muted-foreground">
        {result || '아직 분석 결과가 없습니다.'}
      </CardContent>
    </Card>
  );
}
