// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

/**
 * ⏱ useDebounce
 * - 특정 값이 일정 시간 동안 변화가 없을 때만 해당 값을 반영
 * - 타이핑, 상태 변경 등 빠른 변화에 반응하지 않도록 함
 *
 * @param value - 원본 상태 값
 * @param delay - debounce 지연 시간 (ms)
 * @returns 지연된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
