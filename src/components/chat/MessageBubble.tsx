// components/chat/MessageBubble.tsx
import { useAtomValue } from 'jotai';
import type { Atom } from 'jotai';
import type { ChatMessage } from '@/store/chat/chatAtoms';
import { cn } from '@/lib/utils';

export function MessageBubble({
  messageAtom,
}: {
  messageAtom: Atom<ChatMessage>;
}) {
  const msg = useAtomValue(messageAtom);

  return (
    <div
      className={cn(
        'mb-2 flex',
        msg.role === 'user' ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'px-3 py-2 rounded-lg text-sm whitespace-pre-wrap shadow max-w-[80%]',
          msg.role === 'user'
            ? 'bg-primary text-white'
            : 'bg-muted text-muted-foreground',
        )}
      >
        {msg.content}
      </div>
    </div>
  );
}
