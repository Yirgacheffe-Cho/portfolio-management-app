import { useEffect, useRef, useState } from 'react';

interface UseAutoSaveOptions {
  delay?: number;
  deps?: any[];
  canSave?: () => boolean;
  onSave: () => void | Promise<void>;
}

export function useAutoSave({
  delay = 2000,
  deps = [],
  canSave,
  onSave,
}: UseAutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const isDirtyRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markDirty = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    isDirtyRef.current = true;

    timeoutRef.current = setTimeout(async () => {
      if (!isDirtyRef.current) return;
      if (canSave && !canSave()) return;

      setIsSaving(true);
      try {
        await onSave();
      } finally {
        setIsSaving(false);
        isDirtyRef.current = false;
      }
    }, delay);
  };

  // deps가 바뀌면 dirty 상태 초기화 + debounce 취소
  useEffect(() => {
    isDirtyRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, deps);

  return { markDirty, isSaving };
}
