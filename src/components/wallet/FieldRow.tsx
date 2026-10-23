import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { LuQrCode } from "react-icons/lu";
import { memo, useState } from "react";

import IconButton from "../ui/IconButton";
import MaskedValue from "./MaskedValue";
import useWalletDialogs from "../../hooks/useWalletDialogs";
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
};

/** One labelled value of a wallet, with QR and copy buttons */
export default memo(function FieldRow({
  index,
  label,
  value,
  expanded,
  secret,
  revealAll,
}: FieldRowProps) {
  const { openField } = useWalletDialogs();

  /* Kept per row, so a row hides again once it scrolls out of the list */
  const [isRevealed, setIsRevealed] = useState(false);
  const revealed = !secret || revealAll || isRevealed;

  return (
    <div className="@container bg-neutral-600 rounded-xl">
      {/* Buttons move below the value when the row is narrow */}
      <div className="flex flex-col gap-2 p-4 @3xs:flex-row @3xs:gap-4">
        <div className="flex flex-col gap-1 grow min-w-0 min-h-0">
          <h3 className="text-neutral-300 font-bold text-xs wrap-break-word">
            {label}
          </h3>
          <MaskedValue value={value} revealed={revealed} expanded={expanded} />
        </div>
        <div className="flex items-center justify-end gap-1 shrink-0">
          {secret && !revealAll ? (
            <IconButton
              label={isRevealed ? `Hide ${label}` : `Reveal ${label}`}
              aria-pressed={isRevealed}
              onClick={() => setIsRevealed((prev) => !prev)}
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
            onClick={() => openField(index, label)}
            className={FIELD_BUTTON_CLASS}
          >
            <LuQrCode className="size-4" />
          </IconButton>
          <IconButton
            label={`Copy ${label}`}
            onClick={() => copyToClipboard(value, { secret })}
            className={FIELD_BUTTON_CLASS}
          >
            <IoCopyOutline className="size-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
});
