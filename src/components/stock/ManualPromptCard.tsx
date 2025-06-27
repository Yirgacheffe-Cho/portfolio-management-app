// components/stock/ManualPromptCard.tsx

import { useState, useTransition } from 'react';
import { useAtomValue } from 'jotai';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { generateManualPrompt } from '@/utils/generateManualPrompt';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { selectedTickerAtom } from '@/store/stock/selectedTickerAtom';
import { cn } from '@/lib/utils';

export function ManualPromptCard() {
  const selected = useAtomValue(selectedTickerAtom);
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPendingTransition, startTransition] = useTransition();

  const handleGenerate = () => {
    if (!selected) return;
    startTransition(() => {
      const jsonPrompt = generateManualPrompt(selected);
      const promptText = JSON.stringify(jsonPrompt, null, 2);
      setPrompt(promptText);
    });
  };

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const showSkeleton = !selected && !prompt;
  const showSpinner = isPendingTransition;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          🛠️ 수동 프롬프트 (Perplexity)
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => window.open('https://www.perplexity.ai/', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Perplexity 열기
          </Button>
          <Button onClick={handleGenerate} disabled={!selected || showSpinner}>
            {showSpinner ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-muted border-t-transparent rounded-full" />
                생성 중...
              </span>
            ) : (
              '프롬프트 생성'
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent
        className={cn('px-4 transition-all duration-300 space-y-4 ')}
      >
        {showSpinner ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin h-6 w-6 border-2 border-muted border-t-transparent rounded-full" />
              <p>프롬프트 생성 중입니다...</p>
            </div>
          </div>
        ) : prompt ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium border-b pb-1">
              <span>{selected?.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" /> 복사됨
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" /> 복사
                  </>
                )}
              </Button>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/50 p-4 rounded-md border text-muted-foreground h-[100px] overflow-auto">
              {prompt}
            </div>
          </div>
        ) : showSkeleton ? (
          <div className="h-full w-full bg-muted/40 animate-pulse rounded-lg" />
        ) : null}
      </CardContent>
    </Card>
  );
}
