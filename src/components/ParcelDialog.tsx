import { useEffect } from "react";
import ParcelIcon from "../assets/images/parcel-icon.svg";
import { cn } from "../lib/utils";
import { PopupDialog } from "./PopupDialog";
import { Dialog } from "radix-ui";
import { HiOutlineXMark } from "react-icons/hi2";
import type { GetParcelConfig } from "../types/wallet";

/** Parcel URL from Environment Variables */
const PARCEL_URL = import.meta.env.VITE_PARCEL_URL;

interface ParcelDialogProps {
  wallets: Record<string, string>[];
  getParcelConfig: GetParcelConfig;
}

/** Parcel Dialog Component */
const ParcelDialog = ({ wallets, getParcelConfig }: ParcelDialogProps) => {
  useEffect(() => {
    /** Handle Parcel Ready Message */
    function handleParcelReady(event: MessageEvent) {
      if (event.origin !== new URL(PARCEL_URL).origin) return;
      if (event.data === "ready") {
        const data = getParcelConfig(wallets);

        console.log("Sending data to Parcel:", data);

        event.source!.postMessage(data, { targetOrigin: event.origin });
      }
    }

    /** Listen for Parcel Ready Message */
    window.addEventListener("message", handleParcelReady);

    return () => {
      window.removeEventListener("message", handleParcelReady);
    };
  }, [getParcelConfig, wallets]);

  return (
    <PopupDialog className="p-0 h-full max-h-[768px] overflow-hidden gap-0 max-w-md">
      {/* Header */}
      <div className="flex gap-2 items-center justify-center shrink-0 p-2">
        <div className="size-10 shrink-0" />

        {/* Title */}
        <Dialog.Title className="flex items-center justify-center gap-2 grow min-w-0">
          <img src={ParcelIcon} className="size-6" />
          Parcel
        </Dialog.Title>

        {/* Hidden Description */}
        <Dialog.Description className="sr-only">Split Panel</Dialog.Description>

        {/* Close Button */}
        <div className="size-10 shrink-0">
          {/* Close Parcel */}
          <Dialog.Close
            title="Close Parcel"
            className={cn(
              "size-full text-neutral-400 hover:text-yellow-500 cursor-pointer",
              "flex justify-center items-center"
            )}
          >
            <HiOutlineXMark className="size-5" />
          </Dialog.Close>
        </div>
      </div>

      {/* Iframe */}
      <iframe
        src={new URL("/", PARCEL_URL).href}
        title="Parcel"
        className="border-0 grow"
      />
    </PopupDialog>
  );
};

export { ParcelDialog };
