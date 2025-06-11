import { cn } from '@/lib/utils'; // shadcn 기본 유틸 (clsx 래퍼)

/**
 * ✅ Spinner
 *
 * 앱 내 로딩 상태를 나타내는 일관된 인디케이터 컴포넌트입니다.
 * - Tailwind 기반 회전 애니메이션
 * - 크기/색상은 shadcn muted 스타일을 따릅니다
 * - center 정렬은 외부에서 className으로 지정하세요
 */
const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'w-5 h-5 border-2 border-muted border-t-transparent rounded-full animate-spin',
        className,
      )}
      role="status"
      aria-label="로딩 중"
    />
  );
};

export default Spinner;
