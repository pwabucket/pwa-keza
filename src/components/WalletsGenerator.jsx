import toast from "react-hot-toast";
import { Dialog } from "radix-ui";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCopyOutline,
} from "react-icons/io5";
import { useCallback } from "react";
import { useState } from "react";

import DownloadDialog from "./DownloadDialog";
import InnerAppLayout from "../layouts/InnerAppLayout";
import WalletGeneratorInput from "../components/WalletGeneratorInput";
import useWallets from "../hooks/useWallets";
import { WalletInfoContainer } from "../components/WalletInfo";
import { cn, copyToClipboard } from "../lib/utils";

export default function WalletsGenerator({ id, icon, title, generate }) {
  const [expanded, setExpanded] = useState(false);
  const { count, wallets, setCount, setWallets } = useWallets();

  const generateWallets = useCallback(async () => {
    setWallets(await Promise.all(Array.from({ length: count }).map(generate)));
    toast.dismiss();
    toast.success("Generated!");
  }, [count, setWallets, generate]);

  return (
    <InnerAppLayout
      headerMiddleContent={
        <div className="flex justify-center items-center gap-2">
          <img src={icon} className="size-8" />{" "}
          <h1 className="font-bold">{title}</h1>
        </div>
      }
      className="gap-4"
    >
      <WalletGeneratorInput
        count={count}
        setCount={setCount}
        generate={generateWallets}
      />

      {wallets.length > 0 ? (
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
      ) : (
        <p className="italic text-center">Click generate to start...</p>
      )}
    </InnerAppLayout>
  );
}
