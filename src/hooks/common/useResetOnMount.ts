// hooks/common/useResetOnMount.ts
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import type { PrimitiveAtom } from 'jotai';

/**
 * Jotai atom을 컴포넌트 마운트 시 특정 값으로 초기화하는 범용 훅
 * @param atom 초기화할 jotai atom
 * @param value 설정할 초기값
 */
export function useResetOnMount<T>(atom: PrimitiveAtom<T>, value: T) {
  const set = useSetAtom(atom);

  useEffect(() => {
    set(value);
  }, [set, value]);
}
