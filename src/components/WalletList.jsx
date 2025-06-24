import { Dialog } from "radix-ui";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCopyOutline,
} from "react-icons/io5";

import DownloadDialog from "./DownloadDialog";
import { WalletInfoContainer } from "../components/WalletInfo";
import { cn, copyToClipboard } from "../lib/utils";

export default function WalletList({ id, wallets, expanded, setExpanded }) {
  return (
    <>
      <div className="flex gap-2">
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
          <DownloadDialog
            fileName={`${id}-wallets-${Date.now()}`}
            data={wallets}
          />
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
      <div className="flex flex-col gap-4">
        {wallets.map((wallet, index) => (
          <WalletInfoContainer
            key={index}
            title={`Wallet ${index + 1}`}
            fileName={`${id}-wallet-${Date.now()}-${index + 1}`}
            wallet={wallet}
            expanded={expanded}
          />
        ))}
      </div>
    </>
  );
}
