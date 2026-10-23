import { Dialog } from "radix-ui";
import { useCallback, useState } from "react";

import LabelToggle from "../LabelToggle";
import useSession from "../../hooks/useSession";
import { MAX_PRINT_WALLETS, type PrintOptions } from "./printOptions";
import { PopupDialog } from "../PopupDialog";
import { cn } from "../../lib/utils";

const numberFormat = new Intl.NumberFormat();

/** Chooses what goes on the paper copy and starts printing */
export default function PrintDialog({
  open,
  onClose,
  onPrint,
}: {
  open: boolean;
  onClose: () => void;
  onPrint: (options: PrintOptions) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {open ? <PrintForm onPrint={onPrint} /> : null}
    </Dialog.Root>
  );
}

function PrintForm({ onPrint }: { onPrint: (options: PrintOptions) => void }) {
  const rowCount = useSession((state) => state.rows.length);
  const [includeSecrets, setIncludeSecrets] = useState(true);
  const [includeQRCodes, setIncludeQRCodes] = useState(true);

  const print = useCallback(
    () => onPrint({ includeSecrets, includeQRCodes }),
    [onPrint, includeSecrets, includeQRCodes],
  );

  return (
    <PopupDialog>
      <Dialog.Title className="text-lg font-bold text-center">
        Print paper wallets
      </Dialog.Title>
      <Dialog.Description className="text-center text-neutral-300">
        {rowCount > MAX_PRINT_WALLETS
          ? `Prints the first ${MAX_PRINT_WALLETS} of ${numberFormat.format(rowCount)} wallets.`
          : `Prints ${numberFormat.format(rowCount)} ${rowCount === 1 ? "wallet" : "wallets"}.`}
      </Dialog.Description>

      <div className="flex flex-col gap-3 my-2">
        <LabelToggle
          checked={includeSecrets}
          onChange={() => setIncludeSecrets((prev) => !prev)}
        >
          Include private keys and phrases
        </LabelToggle>
        <LabelToggle
          checked={includeQRCodes}
          onChange={() => setIncludeQRCodes((prev) => !prev)}
        >
          Include QR codes
        </LabelToggle>
      </div>

      {includeSecrets ? (
        <p role="alert" className="text-xs text-yellow-400 text-center">
          Anyone with this paper controls the funds. Printers and print queues
          may keep a copy; prefer a printer you trust, or save as PDF and store
          it encrypted.
        </p>
      ) : null}

      <button
        onClick={print}
        className={cn(
          "px-4 py-2 rounded-xl bg-yellow-500 text-black mt-2",
          "focus-visible:outline-hidden focus-visible:ring-3",
          "focus-visible:ring-yellow-300",
        )}
      >
        Print
      </button>
      <Dialog.Close className="px-4 py-2 rounded-xl bg-neutral-700">
        Cancel
      </Dialog.Close>
    </PopupDialog>
  );
}
