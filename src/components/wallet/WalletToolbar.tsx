import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCopyOutline,
} from "react-icons/io5";
import { TiDownloadOutline } from "react-icons/ti";
import { memo, useCallback } from "react";

import IconButton from "../ui/IconButton";
import ParcelButton from "./ParcelButton";
import useSession from "../../hooks/useSession";
import useSessionStore from "../../hooks/useSessionStore";
import useWalletDialogs from "../../hooks/useWalletDialogs";
import { PARCEL_URL } from "../../lib/parcel";
import { cn, copyToClipboard } from "../../lib/utils";

const TOOLBAR_BUTTON_CLASS = "bg-neutral-600 px-3 py-2 rounded-xl";

/** Sticky actions for the whole wallet list */
export default memo(function WalletToolbar() {
  const store = useSessionStore();
  const getParcelConfig = useSession((state) => state.module?.getParcelConfig);
  const expanded = useSession((state) => state.expanded);
  const toggleExpanded = useSession((state) => state.toggleExpanded);
  const { openDownload } = useWalletDialogs();

  const downloadAll = useCallback(() => openDownload("all"), [openDownload]);
  const copyAll = useCallback(
    () => copyToClipboard(JSON.stringify(store.getState().rows, null, 2)),
    [store],
  );

  return (
    <div
      className={cn(
        "@container flex gap-2 sticky z-30 bg-neutral-800 p-4 -mx-4",
        "top-[calc(3rem+env(safe-area-inset-top))]",
      )}
    >
      {PARCEL_URL && getParcelConfig ? (
        <ParcelButton getParcelConfig={getParcelConfig} />
      ) : null}

      <button
        onClick={downloadAll}
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
      </button>

      <IconButton
        label="Expand values"
        aria-pressed={expanded}
        onClick={toggleExpanded}
        className={TOOLBAR_BUTTON_CLASS}
      >
        {expanded ? (
          <IoChevronUpOutline className="size-4" />
        ) : (
          <IoChevronDownOutline className="size-4" />
        )}
      </IconButton>

      <IconButton
        label="Copy All"
        onClick={copyAll}
        className={TOOLBAR_BUTTON_CLASS}
      >
        <IoCopyOutline className="size-4" />
      </IconButton>
    </div>
  );
});
