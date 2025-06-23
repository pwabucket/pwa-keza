import { Dialog } from "radix-ui";
import { TiDownloadOutline } from "react-icons/ti";

import DownloadDialog from "./DownloadDialog";
import { cn } from "../lib/utils";

export default function DownloadButton({ data, fileName, ...props }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={cn("bg-neutral-600 p-2.5 rounded-xl", props.className)}
      >
        <TiDownloadOutline className="size-4" />
      </Dialog.Trigger>

      <DownloadDialog data={data} fileName={fileName} />
    </Dialog.Root>
  );
}
