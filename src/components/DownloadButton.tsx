import { Dialog } from "radix-ui";
import DownloadDialog from "./DownloadDialog";
import { TiDownloadOutline } from "react-icons/ti";
import { cn } from "../lib/utils";
import { useId } from "react";
import { useLocationToggle } from "@pwabucket/pwa-router";

type DownloadButtonProps = {
  label: string;
  data: Record<string, string>[];
  filename: string;
} & React.ComponentProps<typeof Dialog.Trigger>;

export default function DownloadButton({
  label,
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
        aria-label={label}
        title={label}
        className={cn(
          "bg-neutral-600 p-2.5 rounded-xl",
          "focus-visible:outline-hidden focus-visible:ring-3",
          "focus-visible:ring-yellow-300",
          props.className,
        )}
      >
        <TiDownloadOutline className="size-4" />
      </Dialog.Trigger>

      <DownloadDialog data={data} filename={filename} />
    </Dialog.Root>
  );
}
