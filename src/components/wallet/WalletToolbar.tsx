import { TiDownloadOutline } from "react-icons/ti";
import { memo, useCallback } from "react";

import ListActionButtons from "./ListActionButtons";
import ListActionsMenu from "./ListActionsMenu";
import ParcelButton from "./ParcelButton";
import useSession from "../../hooks/useSession";
import useWalletDialogs from "../../hooks/useWalletDialogs";
import { PARCEL_URL } from "../../lib/parcel";
import { cn } from "../../lib/utils";

/** Sticky actions for the whole wallet list */
export default memo(function WalletToolbar() {
  const getParcelConfig = useSession((state) => state.module?.getParcelConfig);
  const { openDownload } = useWalletDialogs();

  const downloadAll = useCallback(() => openDownload("all"), [openDownload]);

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

      {/* Inline when the toolbar is wide enough, in a menu otherwise */}
      <ListActionButtons className="hidden @sm:flex" />
      <ListActionsMenu className="@sm:hidden" />
    </div>
  );
});
