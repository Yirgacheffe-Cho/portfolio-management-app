import { useRef, useEffect } from 'react';

type Options = {
  /** 최초 호출 시 바로 실행할지 여부 (true면 leading-edge 실행됨) */
  leading?: boolean;
};

/**
 * ⏱ useDebouncedAction
 * 지정한 delay 후 함수를 실행하는 디바운스 훅 (타이핑마다 호출되면 안 되는 경우에 사용)
 *
 * @param callback 실행할 함수 (async 지원됨)
 * @param delay 밀리초 단위 지연 시간 (기본값: 2000ms)
 * @param options 추가 옵션
 *
 * @returns
 *  - trigger: 디바운싱된 함수 실행 트리거
 *  - cancel: 대기 중인 호출 취소 함수
 *
 * @example
 * const { trigger } = useDebouncedAction(() => {
 *   console.log("2초 후 실행");
 * }, 2000);
 *
 * <input onChange={() => trigger()} />
 */
export function useDebouncedAction<T extends any[]>(
  callback: (...args: T) => void | Promise<void>,
  delay = 2000,
  options?: Options,
) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRun = useRef(false);

  const trigger = (...args: T) => {
    if (timeout.current) clearTimeout(timeout.current);
    const { leading = false } = options || {};

    // 선행 실행
    if (leading && !hasRun.current) {
      hasRun.current = true;
      callback(...args);
    }

    // 후행 실행
    timeout.current = setTimeout(() => {
      if (!leading) callback(...args);
      hasRun.current = false;
    }, delay);
  };

  /** ⛔ 타이머 강제 취소 */
  const cancel = () => {
    if (timeout.current) clearTimeout(timeout.current);
  };

  useEffect(() => cancel, []);

  return { trigger, cancel };
}
