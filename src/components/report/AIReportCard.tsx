import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

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
            }}
          >
            {result}
          </ReactMarkdown>
        )}
      </div>
    </ScrollArea>
  );
}
