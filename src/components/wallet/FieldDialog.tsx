import { Dialog } from "radix-ui";
import { QRCodeSVG } from "qrcode.react";

import AppIcon from "../../assets/images/icon.svg";
import useSession from "../../hooks/useSession";
import { PopupDialog } from "../PopupDialog";
import { cn } from "../../lib/utils";

export interface FieldTarget {
  index: number;
  label: string;
}

/** Shows one field's value with its QR code */
export default function FieldDialog({
  target,
  onClose,
}: {
  target: FieldTarget | null;
  onClose: () => void;
}) {
  const value = useSession((state) =>
    target ? state.rows[target.index]?.[target.label] : undefined,
  );

  return (
    <Dialog.Root
      open={value !== undefined}
      onOpenChange={(open) => !open && onClose()}
    >
      {target && value !== undefined ? (
        <PopupDialog>
          <Dialog.Title className="font-light text-xl text-center wrap-break-word">
            {target.label}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Scan the QR code.
          </Dialog.Description>

          {/* Content */}
          <p
            className={cn(
              "bg-neutral-700 p-4 rounded-xl text-neutral-300",
              "font-bold font-mono break-all text-center",
            )}
          >
            {value}
          </p>

          {/* QR Code, scaled down to fit narrow dialogs */}
          <div className="mx-auto w-full max-w-53 p-2.5 rounded-lg bg-white">
            <QRCodeSVG
              value={value}
              title={target.label}
              level={"M"}
              size={192}
              className="block w-full h-auto"
              imageSettings={{
                src: AppIcon,
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                opacity: 1,
                excavate: true,
              }}
            />
          </div>

          <Dialog.Close
            className={cn(
              "bg-yellow-500 text-black",
              "px-4 py-2 rounded-xl",
              "w-full mt-4",
            )}
          >
            Close
          </Dialog.Close>
        </PopupDialog>
      ) : null}
    </Dialog.Root>
  );
}
