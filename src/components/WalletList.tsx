import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCopyOutline,
} from "react-icons/io5";
import { cn, copyToClipboard } from "../lib/utils";
import { useMemo, useState } from "react";
import { TiDownloadOutline } from "react-icons/ti";

import { Dialog } from "radix-ui";
import DownloadDialog from "./DownloadDialog";
import type { GetParcelConfig } from "../types/wallet";
import IconButton from "./ui/IconButton";
import Input from "./Input";
import { PARCEL_URL } from "../lib/parcel";
import { ParcelDialog } from "./ParcelDialog";
import ParcelIcon from "../assets/images/parcel-icon.svg";
import { Virtuoso } from "react-virtuoso";
import { WalletInfoContainer } from "../components/WalletInfo";
import { useLocationToggle } from "@pwabucket/pwa-router";

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
  const [search, setSearch] = useState("");
  const [showParcel, setShowParcel] = useLocationToggle(
    "parcel-dialog",
    "parcel",
  );
  const [showDownload, setShowDownload] = useLocationToggle("download-dialog");

  /* Entries keep each wallet's position in the full list */
  const entries = useMemo(
    () => wallets.map((wallet, index) => ({ wallet, index })),
    [wallets],
  );

  const filteredEntries = useMemo(() => {
    const query = search.toLowerCase();

    return query
      ? entries.filter(({ wallet }) =>
          Object.values(wallet).some((value) =>
            value.toLowerCase().includes(query),
          ),
        )
      : entries;
  }, [search, entries]);

  return (
    <>
      <div
        className={cn(
          "@container flex gap-2 sticky z-30 bg-neutral-800 p-4 -mx-4",
          "top-[calc(3rem+env(safe-area-inset-top))]",
        )}
      >
        {PARCEL_URL && getParcelConfig && (
          <Dialog.Root open={showParcel} onOpenChange={setShowParcel}>
            {/* Parcel Trigger */}
            <Dialog.Trigger asChild>
              <IconButton
                label="Launch Parcel"
                className="bg-neutral-600 py-2 px-3 rounded-xl"
              >
                <img src={ParcelIcon} alt="" className="size-5" />
              </IconButton>
            </Dialog.Trigger>

            <ParcelDialog wallets={wallets} getParcelConfig={getParcelConfig} />
          </Dialog.Root>
        )}
        {/* Download Button */}
        <Dialog.Root open={showDownload} onOpenChange={setShowDownload}>
          <Dialog.Trigger
            aria-label="Download All"
            className={cn(
              "bg-yellow-500 text-black",
              "px-4 py-2 rounded-xl",
              "w-full min-w-0",
              "flex items-center justify-center gap-2",
              "focus-visible:outline-hidden focus-visible:ring-3",
              "focus-visible:ring-yellow-300",
            )}
          >
            <TiDownloadOutline className="size-4 shrink-0" />
            {/* The label shows once the toolbar has room for it */}
            <span className="hidden @3xs:inline truncate">Download All</span>
          </Dialog.Trigger>
          <DownloadDialog filename={`${id}-wallets`} data={wallets} />
        </Dialog.Root>

        {/* Expand Button */}
        <IconButton
          label="Expand values"
          aria-pressed={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          className="bg-neutral-600 px-3 py-2 rounded-xl"
        >
          {expanded ? (
            <IoChevronUpOutline className="size-4" />
          ) : (
            <IoChevronDownOutline className="size-4" />
          )}
        </IconButton>

        {/* Copy Button */}
        <IconButton
          label="Copy All"
          onClick={() => copyToClipboard(JSON.stringify(wallets, null, 2))}
          className="bg-neutral-600 px-3 py-2 rounded-xl"
        >
          <IoCopyOutline className="size-4" />
        </IconButton>
      </div>

      {/* Download warning */}
      <div className="p-4 pt-0">
        <p className="text-xs text-yellow-400 text-center">
          ⚠️ Ensure to download and securely store your wallets before closing
          this page.
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col mb-4 gap-2">
        <Input
          name="search"
          type="search"
          aria-label="Search wallets"
          placeholder="Search wallets"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="text-center" aria-live="polite">
          <span className="font-bold">{search ? "Results" : "Wallets"}:</span>{" "}
          {filteredEntries.length}
        </p>
      </div>

      <div className="flex flex-col">
        <Virtuoso
          useWindowScroll
          data={filteredEntries}
          itemContent={(_, { wallet, index }) => (
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
