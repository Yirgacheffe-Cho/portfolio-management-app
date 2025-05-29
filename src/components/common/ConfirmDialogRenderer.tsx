// components/common/ConfirmDialogRenderer.tsx
import { useAtom } from 'jotai';
import { confirmDialogAtom } from '@/store/common/confirmDialogAtom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConfirmDialogRenderer = () => {
  const [state, setState] = useAtom(confirmDialogAtom);
  const { options, resolve } = state;

  const close = (result: boolean) => {
    resolve?.(result);
    setState({ options: null, resolve: null }); // 닫기
  };

  return (
    <Dialog open={!!options} onOpenChange={(open) => !open && close(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{options?.title}</DialogTitle>
        </DialogHeader>
        {options?.description && (
          <p className="text-sm text-muted-foreground">{options.description}</p>
        )}
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => close(false)}>
            {options?.cancelText ?? '취소'}
          </Button>
          <Button variant="destructive" onClick={() => close(true)}>
            {options?.confirmText ?? '확인'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialogRenderer;
