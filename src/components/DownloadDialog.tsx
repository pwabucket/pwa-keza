import exportFromJSON, { type ExportType } from "export-from-json";
import { Dialog } from "radix-ui";
import { useCallback } from "react";
import { FaFileAlt, FaFileCsv, FaFileExcel, FaFileCode } from "react-icons/fa";

import { cn } from "../lib/utils";
import { openSafe } from "../lib/safe";
import SafeIcon from "../assets/images/safe-icon.svg";
import { PopupDialog } from "./PopupDialog";
import { format } from "date-fns";

const getExportFilename = (base: string) => {
  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
  return `keza-${base}-${timestamp}`;
};

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
        fileName: getExportFilename(filename),
        exportType,
      });
    },
    [data, filename]
  );

  const encryptWithSafe = useCallback(() => {
    const result = exportFromJSON({
      data,
      fileName: getExportFilename(filename),
      exportType: exportFromJSON.types.txt,
      processor: (content, type, filename) => ({
        type,
        filename,
        content,
      }),
    });

    console.log("Encrypting with Safe:", result);

    openSafe({
      filename: result.filename,
      type: "file",
      content: new File([result.content], result.filename, {
        type: "text/plain",
        lastModified: Date.now(),
      }),
    });
  }, [filename, data]);

  const getFileIcon = (type: ExportType) => {
    switch (type) {
      case "txt":
        return <FaFileAlt className="size-5" />;
      case "csv":
        return <FaFileCsv className="size-5" />;
      case "xls":
        return <FaFileExcel className="size-5" />;
      case "json":
        return <FaFileCode className="size-5" />;
      default:
        return <FaFileAlt className="size-5" />;
    }
  };

  return (
    <PopupDialog>
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
            "font-bold uppercase",
            "bg-neutral-700 rounded-xl",
            "flex justify-center items-center gap-2",
            "px-4 py-2 text-left"
          )}
          onClick={() => download(type)}
        >
          {getFileIcon(type)}
          <span className="min-w-10">{type}</span>
        </button>
      ))}
      {/* Cancel Button */}
      <Dialog.Close
        className={cn("px-4 py-2 bg-yellow-500 text-black rounded-xl")}
      >
        Close
      </Dialog.Close>
    </PopupDialog>
  );
}
