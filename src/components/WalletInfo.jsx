import { IoCopyOutline } from "react-icons/io5";

import DownloadButton from "./DownloadButton";
import { cn, copyToClipboard } from "../lib/utils";

export const WalletInfoContainer = ({
  expanded,
  title,
  fileName,
  wallet,
  ...props
}) => (
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
        <DownloadButton title="Download" fileName={fileName} data={[wallet]} />
      </div>
    </div>
    {Object.entries(wallet).map(([k, v], index) => (
      <WalletInfo key={index} title={k} value={v} expanded={expanded} />
    ))}
  </div>
);

export const WalletInfo = ({ expanded, title, value }) => (
  <div className="flex gap-4 p-4 bg-neutral-600 rounded-xl">
    <div className="flex flex-col grow min-w-0 min-h-0">
      <h2 className="text-neutral-400 font-bold text-xs">{title}</h2>
      <p
        className={cn(
          "font-bold font-mono",
          expanded ? "break-words" : "truncate"
        )}
      >
        {value}
      </p>
    </div>
    <button className="shrink-0" onClick={() => copyToClipboard(value)}>
      <IoCopyOutline className="size-4" />
    </button>
  </div>
);
