import { IoCopyOutline } from "react-icons/io5";
import { LuQrCode } from "react-icons/lu";
import { memo } from "react";

import IconButton from "../ui/IconButton";
import useWalletDialogs from "../../hooks/useWalletDialogs";
import { cn, copyToClipboard } from "../../lib/utils";

const FIELD_BUTTON_CLASS = "bg-neutral-500 p-2 rounded-lg";

type FieldRowProps = {
  index: number;
  label: string;
  value: string;
  expanded: boolean;
};

/** One labelled value of a wallet, with QR and copy buttons */
export default memo(function FieldRow({
  index,
  label,
  value,
  expanded,
}: FieldRowProps) {
  const { openField } = useWalletDialogs();

  return (
    <div className="@container bg-neutral-600 rounded-xl">
      {/* Buttons move below the value when the row is narrow */}
      <div className="flex flex-col gap-2 p-4 @3xs:flex-row @3xs:gap-4">
        <div className="flex flex-col gap-1 grow min-w-0 min-h-0">
          <h3 className="text-neutral-300 font-bold text-xs wrap-break-word">
            {label}
          </h3>
          <p
            className={cn(
              "font-bold font-mono",
              expanded ? "break-all" : "truncate",
            )}
          >
            {value}
          </p>
        </div>
        <div className="flex items-center justify-end gap-1 shrink-0">
          <IconButton
            label={`Show ${label} QR code`}
            onClick={() => openField(index, label)}
            className={FIELD_BUTTON_CLASS}
          >
            <LuQrCode className="size-4" />
          </IconButton>
          <IconButton
            label={`Copy ${label}`}
            onClick={() => copyToClipboard(value)}
            className={FIELD_BUTTON_CLASS}
          >
            <IoCopyOutline className="size-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
});
