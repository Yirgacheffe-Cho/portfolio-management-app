import { useEffect, useState } from 'react';

/**
 * ✅ useDelayedPending
 * 짧은 isPending 상태일 때는 숨기고, 일정 시간 이상일 때만 true 반환
 */
export const useDelayedPending = (isPending: boolean, delay = 150): boolean => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setShow(false);
      return;
    }

    const timeout = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeout);
  }, [isPending, delay]);

  return show;
};
