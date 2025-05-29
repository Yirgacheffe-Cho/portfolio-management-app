// store/common/confirmDialogAtom.ts
import { atom } from 'jotai';

export type ConfirmDialogOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmDialogState = {
  options: ConfirmDialogOptions | null;
  resolve: ((result: boolean) => void) | null;
};

export const confirmDialogAtom = atom<ConfirmDialogState>({
  options: null,
  resolve: null,
});
