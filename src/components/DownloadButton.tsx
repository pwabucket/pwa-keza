import { Dialog } from "radix-ui";
import { TiDownloadOutline } from "react-icons/ti";

import DownloadDialog from "./DownloadDialog";
import { cn } from "../lib/utils";
import useLocationToggle from "../hooks/useLocationToggle";
import { useId } from "react";

type DownloadButtonProps = {
  data: Record<string, string>[];
  filename: string;
} & React.ComponentProps<typeof Dialog.Trigger>;

export default function DownloadButton({
  data,
  filename,
  ...props
}: DownloadButtonProps) {
  const id = useId();
  const [show, setShow] = useLocationToggle(`download-dialog-${id}`);

  return (
    <Dialog.Root open={show} onOpenChange={setShow}>
      <Dialog.Trigger
        {...props}
        className={cn("bg-neutral-600 p-2.5 rounded-xl", props.className)}
      >
        <TiDownloadOutline className="size-4" />
      </Dialog.Trigger>

      <DownloadDialog data={data} filename={filename} />
    </Dialog.Root>
  );
}
