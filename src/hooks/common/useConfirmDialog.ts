// hooks/common/useConfirmDialog.ts
import { useSetAtom } from 'jotai';
import { confirmDialogAtom } from '@/store/common/confirmDialogAtom';
import type { ConfirmDialogOptions } from '@/store/common/confirmDialogAtom';

export const useConfirmDialog = () => {
  const setDialog = useSetAtom(confirmDialogAtom);

  const confirm = (options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({ options, resolve });
    });
  };

  return confirm;
};
