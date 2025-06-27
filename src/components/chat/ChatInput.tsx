// components/chat/ChatInput.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
  onSubmit: (text: string) => void;
  disabled?: boolean;
};

/**
 * 채팅 입력 필드 컴포넌트
 * 내부적으로 상태를 갖고 있으며 부모 렌더 영향 받지 않음
 */
export function ChatInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
  };
  console.log('⌨️ ChatInput 렌더');
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="예: 이 종목의 목표가 평균은?"
        className="flex-1"
        disabled={disabled}
      />
      <Button onClick={handleSend} disabled={!value.trim() || disabled}>
        {disabled ? '분석 중...' : '전송'}
      </Button>
    </div>
  );
}
