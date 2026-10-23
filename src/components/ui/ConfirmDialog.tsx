import { Dialog } from "radix-ui";
import { useCallback, useRef } from "react";

import { PopupDialog } from "../PopupDialog";
import { cn } from "../../lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Asks the user to confirm an action that can't be undone */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  /* The safe choice gets focus, so a stray Enter never confirms */
  const focusCancel = useCallback((event: Event) => {
    event.preventDefault();
    cancelRef.current?.focus();
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <PopupDialog onOpenAutoFocus={focusCancel}>
        <Dialog.Title className="text-lg font-bold text-center">
          {title}
        </Dialog.Title>
        <Dialog.Description className="text-center text-neutral-300">
          {description}
        </Dialog.Description>

        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={onConfirm}
            className={cn(
              "px-4 py-2 rounded-xl bg-red-500 text-white",
              "focus-visible:outline-hidden focus-visible:ring-3",
              "focus-visible:ring-yellow-300",
            )}
          >
            {confirmLabel}
          </button>
          <Dialog.Close
            ref={cancelRef}
            className={cn(
              "px-4 py-2 rounded-xl bg-neutral-700",
              "focus-visible:outline-hidden focus-visible:ring-3",
              "focus-visible:ring-yellow-300",
            )}
          >
            {cancelLabel}
          </Dialog.Close>
        </div>
      </PopupDialog>
    </Dialog.Root>
  );
}
