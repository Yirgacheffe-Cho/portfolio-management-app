// components/report/AIReportCard.tsx

import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils'; // cn 유틸리티 함수 임포트

interface Props {
  result: string;
}

export function AIReportCard({ result }: Props) {
  const isEmpty = !result || result.trim().length === 0;

  return (
    <ScrollArea className="h-full pr-2">
      <div
        className={cn(
          'prose prose-sm dark:prose-invert max-w-none transition-all duration-200',
          isEmpty &&
            'flex items-center justify-center h-full text-sm text-muted-foreground',
        )}
      >
        {isEmpty ? (
          '아직 분석 결과가 없습니다.'
        ) : (
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
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold mt-4 mb-1">{children}</h3>
              ),
              li: ({ children }) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              p: ({ children }) => (
                <p className="mb-3 leading-relaxed">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="text-foreground font-semibold">
                  {children}
                </strong>
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
                // 💡 수정된 부분: "whitespace-nowrap" 클래스 제거
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {children}
                </td>
              ),
            }}
          >
            {result}
          </ReactMarkdown>
        )}
      </div>
    </ScrollArea>
  );
}
