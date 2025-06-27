// components/stock/StockAITab.tsx
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { selectedTickerAtom } from '@/store/stock/selectedTickerAtom';
import { isAIAnalyzedAtom } from '@/store/stock/aiInsightAtom';
import { AIInsightCard } from '@/components/common/AIInsightCard';
import { StockChatPanel } from '@components/chat/StockChatPanel';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';

type Props = {
  handleAnalyze: () => Promise<string>;
};

export function StockAITab({ handleAnalyze }: Props) {
  const selected = useAtomValue(selectedTickerAtom);
  const analyzed = useAtomValue(isAIAnalyzedAtom);
  const [showChat, setShowChat] = useState(false);

  return (
    <TabsContent value="ai">
      <AIInsightCard
        title={`${selected?.name || '종목'} 정보`}
        onAnalyze={handleAnalyze}
        disabled={!selected}
        resetOnDisabledChange
      />

      {/* 분석 완료 시만 버튼 노출 */}
      {analyzed && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => setShowChat((prev) => !prev)}
            className="w-full"
          >
            {showChat ? '질문 닫기' : '➕ 추가 질문하기'}
          </Button>
        </div>
      )}
      {/* 버튼이 눌렸을 때만 채팅 UI 출력 */}
      {showChat && (
        <div className="mt-4">
          <StockChatPanel />
        </div>
      )}
    </TabsContent>
  );
}
