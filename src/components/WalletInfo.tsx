import { Dialog } from "radix-ui";
import { IoCopyOutline } from "react-icons/io5";
import { LuQrCode } from "react-icons/lu";

import DownloadButton from "./DownloadButton";
import QRCodeDialog from "./QRCodeDialog";
import { cn, copyToClipboard } from "../lib/utils";
import { useId } from "react";
import useLocationToggle from "../hooks/useLocationToggle";

type WalletInfoContainerProps = {
  expanded: boolean;
  title: string;
  filename: string;
  wallet: Record<string, string>;
} & React.ComponentProps<"div">;

const WalletInfoButton = (props: React.ComponentProps<"button">) => (
  <button
    {...props}
    className={cn("bg-neutral-500 p-2 rounded-lg", props.className)}
  />
);

export const WalletInfoContainer = ({
  expanded,
  title,
  filename,
  wallet,
  ...props
}: WalletInfoContainerProps) => (
  <div
    {...props}
    className={cn(
      "p-4 rounded-xl bg-neutral-700 flex flex-col gap-2",
      "border border-transparent",
      "hover:border-yellow-500",
      props.className
    )}
  >
    <div className="flex px-2 gap-4 items-center">
      {/* Title */}
      <h1 className="text-lg font-extralight grow min-w-0">{title}</h1>

      <div className="flex shrink-0 gap-2">
        {/* Copy Button */}
        <button
          title="Copy"
          onClick={() => copyToClipboard(JSON.stringify(wallet, null, 2))}
          className={cn("bg-neutral-600 p-2.5 rounded-xl")}
        >
          <IoCopyOutline className="size-4" />
        </button>
        <DownloadButton title="Download" filename={filename} data={[wallet]} />
      </div>
    </div>
    {Object.entries(wallet).map(([k, v], index) => (
      <WalletInfo key={index} title={k} value={v} expanded={expanded} />
    ))}
  </div>
);

export const WalletInfo = ({
  expanded,
  title,
  value,
}: {
  expanded: boolean;
  title: string;
  value: string;
}) => {
  const id = useId();
  const [showQR, setShowQR] = useLocationToggle(`qr-dialog-${id}`);
  return (
    <div className="flex gap-4 p-4 bg-neutral-600 rounded-xl">
      <div className="flex flex-col gap-1 grow min-w-0 min-h-0">
        <h2 className="text-neutral-400 font-bold text-xs">{title}</h2>
        <p
          className={cn(
            "font-bold font-mono",
            expanded ? "break-all" : "truncate"
          )}
        >
          {value}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Dialog.Root open={showQR} onOpenChange={setShowQR}>
          <Dialog.Trigger asChild>
            <WalletInfoButton>
              <LuQrCode className="size-4" />
            </WalletInfoButton>
          </Dialog.Trigger>
          <QRCodeDialog title={title} content={value} />
        </Dialog.Root>
        <WalletInfoButton
          className="shrink-0"
          onClick={() => copyToClipboard(value)}
        >
          <IoCopyOutline className="size-4" />
        </WalletInfoButton>
      </div>
    </div>
  );
};
