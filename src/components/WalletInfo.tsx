import { cn, copyToClipboard } from "../lib/utils";

import { Dialog } from "radix-ui";
import DownloadButton from "./DownloadButton";
import IconButton from "./ui/IconButton";
import { IoCopyOutline } from "react-icons/io5";
import { LuQrCode } from "react-icons/lu";
import QRCodeDialog from "./QRCodeDialog";
import { useId } from "react";
import { useLocationToggle } from "@pwabucket/pwa-router";

type WalletInfoContainerProps = {
  expanded: boolean;
  title: string;
  filename: string;
  wallet: Record<string, string>;
} & React.ComponentProps<"div">;

const WalletInfoButton = (props: React.ComponentProps<typeof IconButton>) => (
  <IconButton
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
      props.className,
    )}
  >
    <div className="flex px-2 gap-2 items-center">
      {/* Title */}
      <h2 className="text-lg font-extralight grow min-w-0 truncate">{title}</h2>

      <div className="flex shrink-0 gap-2">
        {/* Copy Button */}
        <IconButton
          label={`Copy ${title}`}
          onClick={() => copyToClipboard(JSON.stringify(wallet, null, 2))}
          className="bg-neutral-600 p-2.5 rounded-xl"
        >
          <IoCopyOutline className="size-4" />
        </IconButton>
        <DownloadButton
          label={`Download ${title}`}
          filename={filename}
          data={[wallet]}
        />
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
    <div className="@container bg-neutral-600 rounded-xl">
      {/* Buttons move below the value when the row is narrow */}
      <div className="flex flex-col gap-2 p-4 @3xs:flex-row @3xs:gap-4">
        <div className="flex flex-col gap-1 grow min-w-0 min-h-0">
          <h3 className="text-neutral-300 font-bold text-xs wrap-break-word">
            {title}
          </h3>
          <p
            className={cn(
              "font-bold font-mono",
              expanded ? "break-all" : "truncate",
            )}
          >
            {value}
          </p>
        </div>
        <div className="flex items-center justify-end gap-1 shrink-0">
          <Dialog.Root open={showQR} onOpenChange={setShowQR}>
            <Dialog.Trigger asChild>
              <WalletInfoButton label={`Show ${title} QR code`}>
                <LuQrCode className="size-4" />
              </WalletInfoButton>
            </Dialog.Trigger>
            <QRCodeDialog title={title} content={value} />
          </Dialog.Root>
          <WalletInfoButton
            label={`Copy ${title}`}
            onClick={() => copyToClipboard(value)}
          >
            <IoCopyOutline className="size-4" />
          </WalletInfoButton>
        </div>
      </div>
    </div>
  );
};
