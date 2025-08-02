import { Dialog } from "radix-ui";
import { QRCodeSVG } from "qrcode.react";

import AppIcon from "../assets/images/icon.svg";
import { cn } from "../lib/utils";

export default function QRCodeDialog({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          "fixed inset-0 z-40",
          "flex items-center justify-center",
          "p-4 overflow-auto bg-black/70"
        )}
      >
        <Dialog.Content className="flex flex-col w-full max-w-sm gap-2 p-4 bg-neutral-800 rounded-xl">
          <Dialog.Title className="font-light text-xl text-center">
            {title}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Scan the QR code.
          </Dialog.Description>

          {/* Content */}
          <p className="bg-neutral-700 p-4 rounded-xl text-neutral-300 font-bold break-words text-center">
            {content}
          </p>

          {/* QR Code */}
          <div className="mx-auto p-2.5 rounded-lg bg-white">
            <QRCodeSVG
              value={content}
              title={title}
              level={"M"}
              size={192}
              imageSettings={{
                src: AppIcon,
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                opacity: 1,
                excavate: true,
              }}
            />
          </div>

          <Dialog.Close
            className={cn(
              "bg-yellow-500 text-black",
              "px-4 py-2 rounded-xl",
              "w-full mt-4"
            )}
          >
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
}
