import exportFromJSON, { type ExportType } from "export-from-json";
import { Dialog } from "radix-ui";
import { useCallback } from "react";

import { cn } from "../lib/utils";
import { openSafe } from "../lib/safe";
import SafeIcon from "../assets/images/safe-icon.svg";

export default function DownloadDialog({
  data,
  filename,
}: {
  data: Record<string, string>[];
  filename: string;
}) {
  const download = useCallback(
    (exportType: ExportType) => {
      exportFromJSON({
        data,
        fileName: filename,
        exportType,
      });
    },
    [data, filename]
  );

  const encryptWithSafe = useCallback(() => {
    const result = exportFromJSON({
      data,
      fileName: filename,
      exportType: exportFromJSON.types.txt,
      processor: (content, type, filename) => ({
        type,
        filename,
        content,
      }),
    });

    openSafe({
      filename: result.filename,
      type: "file",
      content: new File([result.content], result.filename, {
        type: "text/plain",
        lastModified: Date.now(),
      }),
    });
  }, [filename, data]);

  return (
    <Dialog.Overlay
      className={cn(
        "fixed inset-0 z-40",
        "flex items-center justify-center",
        "p-4 overflow-auto bg-black/70"
      )}
    >
      <Dialog.Content className="flex flex-col w-full max-w-sm gap-2 p-4 bg-neutral-800 rounded-xl">
        <div className="flex flex-col">
          {/* Title */}
          <Dialog.Title
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "font-monoton text-center text-2xl"
            )}
          >
            Download
          </Dialog.Title>
          {/* Description */}
          <Dialog.Description className="px-2 text-center text-neutral-300">
            Export to different formats
          </Dialog.Description>
        </div>

        {/* Encrypt with Safe */}
        <button
          onClick={encryptWithSafe}
          className={cn(
            "font-bold text-center uppercase",
            "px-4 py-1",
            "bg-neutral-700 rounded-xl text-green-300",
            "flex items-center justify-center gap-2"
          )}
        >
          <img src={SafeIcon} alt="Safe Icon" className="size-6 rounded-full" />
          Encrypt with Safe
        </button>

        {/* Export Buttons */}
        {[
          exportFromJSON.types.txt,
          exportFromJSON.types.csv,
          exportFromJSON.types.xls,
          exportFromJSON.types.json,
        ].map((type) => (
          <button
            key={type}
            className={cn(
              "font-bold text-center uppercase",
              "px-4 py-2",
              "bg-neutral-700 rounded-xl"
            )}
            onClick={() => download(type)}
          >
            {type}
          </button>
        ))}
        {/* Cancel Button */}
        <Dialog.Close
          className={cn("px-4 py-2 bg-yellow-500 text-black rounded-xl")}
        >
          Close
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Overlay>
  );
}
