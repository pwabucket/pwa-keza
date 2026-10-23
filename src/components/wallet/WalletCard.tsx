import { IoCopyOutline } from "react-icons/io5";
import { TiDownloadOutline } from "react-icons/ti";
import { memo } from "react";

import FieldRow from "./FieldRow";
import IconButton from "../ui/IconButton";
import useWalletDialogs from "../../hooks/useWalletDialogs";
import { cn, copyToClipboard } from "../../lib/utils";
import type { WalletRow } from "../../types/wallet";

const CARD_BUTTON_CLASS = "bg-neutral-600 p-2.5 rounded-xl";

type WalletCardProps = {
  /** Position in the full list, which numbers the wallet */
  index: number;
  row: WalletRow;
  expanded: boolean;
};

/** One wallet with all of its fields */
export default memo(function WalletCard({
  index,
  row,
  expanded,
}: WalletCardProps) {
  const { openDownload } = useWalletDialogs();
  const title = `Wallet ${index + 1}`;

  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-neutral-700 flex flex-col gap-2",
        "border border-transparent",
        "hover:border-yellow-500",
      )}
    >
      <div className="flex px-2 gap-2 items-center">
        <h2 className="text-lg font-extralight grow min-w-0 truncate">
          {title}
        </h2>

        <div className="flex shrink-0 gap-2">
          <IconButton
            label={`Copy ${title}`}
            onClick={() => copyToClipboard(JSON.stringify(row, null, 2))}
            className={CARD_BUTTON_CLASS}
          >
            <IoCopyOutline className="size-4" />
          </IconButton>
          <IconButton
            label={`Download ${title}`}
            onClick={() => openDownload(index)}
            className={CARD_BUTTON_CLASS}
          >
            <TiDownloadOutline className="size-4" />
          </IconButton>
        </div>
      </div>

      {Object.entries(row).map(([label, value]) => (
        <FieldRow
          key={label}
          index={index}
          label={label}
          value={value}
          expanded={expanded}
        />
      ))}
    </div>
  );
});
