import type { ChatMessage } from '@/store/chat/chatAtoms';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TypingDots } from './TypingDots';
import { memo } from 'react';
import 'highlight.js/styles/github-dark.css';

function MessageBubbleComponent({ message }: { message: ChatMessage }) {
  console.log('💬 message content:', message);
  if (message.id === '__typing__') {
    return (
      <div className="mb-2 flex justify-start">
        <div className="px-3 py-2 rounded-lg bg-muted text-muted-foreground text-sm shadow max-w-[80%]">
          <TypingDots />
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        'mb-2 flex',
        message.role === 'user' ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'px-3 py-2 rounded-lg text-sm shadow max-w-[80%]',
          message.role === 'user'
            ? 'bg-primary text-white'
            : 'bg-muted text-muted-foreground',
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-lg font-bold mt-6 mb-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-semibold mt-5 mb-2">
                  {children}
                </h2>
              ),
              /*************  ✨ Windsurf Command ⭐  *************/
              /**
               * Renders a level 3 heading with specific styling.
               * The heading is styled with a small font size, semi-bold font weight,
               * and margin applied on top and bottom.
               *
               * @param children - The content to be displayed within the heading.
               */

              /*******  4911a30b-d5c5-4fac-82db-107730b8ab01  *******/
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold mt-4 mb-1">{children}</h3>
              ),
              p: ({ children }) => <p className="mb-3">{children}</p>,
              li: ({ children }) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="text-foreground font-semibold">
                  {children}
                </strong>
              ),
              code: ({ children }) => (
                <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                  {children}
                </pre>
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto w-full my-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <table
                    className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                    {...props}
                  />
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gray-50 dark:bg-gray-800">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {children}
                </td>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

// ✅ React.memo로 감싸서 리렌더링 방지
export const MessageBubble = memo(MessageBubbleComponent);

export default MessageBubble;
