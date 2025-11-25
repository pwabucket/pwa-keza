import { Dialog } from "radix-ui";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCopyOutline,
} from "react-icons/io5";
import { Virtuoso } from "react-virtuoso";

import DownloadDialog from "./DownloadDialog";
import { WalletInfoContainer } from "../components/WalletInfo";
import { cn, copyToClipboard } from "../lib/utils";
import ParcelIcon from "../assets/images/parcel-icon.svg";
import { ParcelDialog } from "./ParcelDialog";
import type { GetParcelConfig } from "../types/wallet";

type WalletListProps = {
  id: string;
  wallets: Record<string, string>[];
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  getParcelConfig?: GetParcelConfig;
};

export default function WalletList({
  id,
  wallets,
  expanded,
  setExpanded,
  getParcelConfig,
}: WalletListProps) {
  return (
    <>
      <div className="flex gap-2 sticky top-12 z-30 bg-neutral-800 p-4 -mx-4">
        {getParcelConfig && (
          <Dialog.Root>
            {/* Parcel Trigger */}
            <Dialog.Trigger
              title="Launch Parcel"
              className={cn("bg-neutral-600 py-2 px-3 rounded-xl", "shrink-0")}
            >
              <img src={ParcelIcon} className="size-5" />
            </Dialog.Trigger>

            <ParcelDialog wallets={wallets} getParcelConfig={getParcelConfig} />
          </Dialog.Root>
        )}
        {/* Download Button */}
        <Dialog.Root>
          <Dialog.Trigger
            className={cn(
              "bg-yellow-500 text-black",
              "px-4 py-2 rounded-xl",
              "w-full"
            )}
          >
            Download All
          </Dialog.Trigger>
          <DownloadDialog filename={`${id}-wallets`} data={wallets} />
        </Dialog.Root>

        {/* Expand Button */}
        <button
          title="Toggle Expansion"
          onClick={() => setExpanded((prev) => !prev)}
          className={cn("bg-neutral-600 px-3 py-2 rounded-xl", "shrink-0")}
        >
          {expanded ? (
            <IoChevronUpOutline className="size-4" />
          ) : (
            <IoChevronDownOutline className="size-4" />
          )}
        </button>

        {/* Copy Button */}
        <button
          title="Copy All"
          onClick={() => copyToClipboard(JSON.stringify(wallets, null, 2))}
          className={cn("bg-neutral-600 px-3 py-2 rounded-xl", "shrink-0")}
        >
          <IoCopyOutline className="size-4" />
        </button>
      </div>
      <div className="p-4 pt-0">
        <p className="text-xs text-yellow-400 text-center">
          ⚠️ Ensure to download and securely store your wallets before closing
          this page.
        </p>
      </div>

      <div className="flex flex-col">
        <Virtuoso
          useWindowScroll
          data={wallets}
          itemContent={(index, wallet) => (
            <div className="pb-4">
              <WalletInfoContainer
                title={`Wallet ${index + 1}`}
                filename={`${id}-wallet-${index + 1}`}
                wallet={wallet}
                expanded={expanded}
              />
            </div>
          )}
        />
      </div>
    </>
  );
}
