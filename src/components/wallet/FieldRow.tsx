import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { LuQrCode } from "react-icons/lu";
import { memo, useCallback, useState } from "react";

import IconButton from "../ui/IconButton";
import MaskedValue from "./MaskedValue";
import useWalletDialogs from "../../hooks/useWalletDialogs";
import { cn } from "../../lib/utils";
import { copyToClipboard } from "../../lib/clipboard";

const FIELD_BUTTON_CLASS = "bg-neutral-500 p-2 rounded-lg";

type FieldRowProps = {
  index: number;
  label: string;
  value: string;
  expanded: boolean;
  /** Hidden until revealed, and cleared from the clipboard after copying */
  secret: boolean;
  revealAll: boolean;
  note?: string;
};

/** One labelled value of a wallet, with QR and copy buttons */
export default memo(function FieldRow({
  index,
  label,
  value,
  expanded,
  secret,
  revealAll,
  note,
}: FieldRowProps) {
  const { openField } = useWalletDialogs();

  /* Kept per row, so a row hides again once it scrolls out of the list */
  const [isRevealed, setIsRevealed] = useState(false);
  const revealed = !secret || revealAll || isRevealed;

  /* e.g. the phrase of a vanity wallet, which has none */
  const isEmpty = value === "";

  const toggleRevealed = useCallback(() => setIsRevealed((prev) => !prev), []);
  const showQRCode = useCallback(
    () => openField(index, label),
    [openField, index, label],
  );
  const copyValue = useCallback(
    () => copyToClipboard(value, { secret }),
    [value, secret],
  );

  return (
    <div className="@container bg-neutral-600 rounded-xl">
      {/* Buttons move below the value when the row is narrow */}
      <div className="flex flex-col gap-2 p-4 @3xs:flex-row @3xs:gap-4">
        <div className="flex flex-col gap-1 grow min-w-0 min-h-0">
          <h3 className="text-neutral-300 font-bold text-xs wrap-break-word">
            {label}
          </h3>
          {note ? <p className="text-xs text-neutral-400">{note}</p> : null}
          {isEmpty ? (
            <p className="text-neutral-400 italic">None</p>
          ) : (
            <MaskedValue
              value={value}
              revealed={revealed}
              expanded={expanded}
            />
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-end gap-1 shrink-0",
            isEmpty && "hidden",
          )}
        >
          {secret && !revealAll ? (
            <IconButton
              label={isRevealed ? `Hide ${label}` : `Reveal ${label}`}
              aria-pressed={isRevealed}
              onClick={toggleRevealed}
              className={FIELD_BUTTON_CLASS}
            >
              {isRevealed ? (
                <HiOutlineEyeSlash className="size-4" />
              ) : (
                <HiOutlineEye className="size-4" />
              )}
            </IconButton>
          ) : null}
          <IconButton
            label={`Show ${label} QR code`}
            onClick={showQRCode}
            className={FIELD_BUTTON_CLASS}
          >
            <LuQrCode className="size-4" />
          </IconButton>
          <IconButton
            label={`Copy ${label}`}
            onClick={copyValue}
            className={FIELD_BUTTON_CLASS}
          >
            <IoCopyOutline className="size-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
});
