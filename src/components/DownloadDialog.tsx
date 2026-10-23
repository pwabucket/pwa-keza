import exportFromJSON, { type ExportType } from "export-from-json";
import { Dialog } from "radix-ui";
import { useCallback } from "react";
import {
  FaFileAlt,
  FaFileCsv,
  FaFileExcel,
  FaFileCode,
  FaLock,
} from "react-icons/fa";
import { useLocationToggle } from "@pwabucket/pwa-router";

import { cn } from "../lib/utils";
import { openSafe } from "../lib/safe";
import SafeIcon from "../assets/images/safe-icon.svg";
import PasswordDialog from "./ui/PasswordDialog";
import { PopupDialog } from "./PopupDialog";
import { encryptBackup } from "../lib/crypto-envelope";
import { format } from "date-fns";

/** Shortest password accepted for an encrypted backup */
const MIN_PASSWORD_LENGTH = 8;

const EXPORT_TYPES = [
  exportFromJSON.types.txt,
  exportFromJSON.types.csv,
  exportFromJSON.types.xls,
  exportFromJSON.types.json,
];

const FILE_ICONS: Partial<Record<ExportType, React.ReactNode>> = {
  txt: <FaFileAlt className="size-5" />,
  csv: <FaFileCsv className="size-5" />,
  xls: <FaFileExcel className="size-5" />,
  json: <FaFileCode className="size-5" />,
};

const getExportFilename = (base: string) => {
  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
  return `keza-${base}-${timestamp}`;
};

export default function DownloadDialog({
  data,
  filename,
  moduleId,
  onExport,
}: {
  data: Record<string, string>[];
  filename: string;
  /** Stored inside encrypted backups, so Restore knows the wallet type */
  moduleId: string | null;
  /** Called after the data has been handed off for saving */
  onExport?: () => void;
}) {
  const download = useCallback(
    (exportType: ExportType) => {
      exportFromJSON({
        data,
        fileName: getExportFilename(filename),
        exportType,
      });
      onExport?.();
    },
    [data, filename, onExport]
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

    openSafe({
      filename: result.filename,
      type: "file",
      content: new File([result.content], result.filename, {
        type: "text/plain",
        lastModified: Date.now(),
      }),
      onHandoff: onExport,
    });
  }, [filename, data, onExport]);

  const [isEncrypting, setIsEncrypting] = useLocationToggle(
    "encrypt-password"
  );

  const encryptWithPassword = useCallback(
    async (password: string) => {
      const envelope = await encryptBackup({ moduleId, rows: data }, password);

      exportFromJSON({
        data: envelope,
        fileName: getExportFilename(`${filename}-encrypted`),
        exportType: exportFromJSON.types.json,
      });
      onExport?.();
      setIsEncrypting(false);
    },
    [moduleId, data, filename, onExport, setIsEncrypting]
  );

  return (
    <PopupDialog>
      <div className="flex flex-col">
        {/* Title */}
        <Dialog.Title
          className={cn(
            "inline-flex items-center justify-center gap-2",
            "text-center text-2xl font-bold",
            "sm:font-monoton sm:font-normal"
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

      {/* Encrypt with a password, restorable here */}
      <button
        onClick={() => setIsEncrypting(true)}
        className={cn(
          "font-bold text-center uppercase",
          "px-4 py-2",
          "bg-neutral-700 rounded-xl text-green-300",
          "flex items-center justify-center gap-2"
        )}
      >
        <FaLock className="size-4" />
        Encrypt with password
      </button>

      {/* Export Buttons */}
      {EXPORT_TYPES.map((type) => (
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
          {FILE_ICONS[type]}
          <span className="min-w-10">{type}</span>
        </button>
      ))}
      {/* Cancel Button */}
      <Dialog.Close
        className={cn("px-4 py-2 bg-yellow-500 text-black rounded-xl")}
      >
        Close
      </Dialog.Close>

      <PasswordDialog
        open={isEncrypting}
        title="Encrypt backup"
        description="You'll need this password to restore the backup. It can't be recovered."
        submitLabel="Encrypt and download"
        confirm
        minLength={MIN_PASSWORD_LENGTH}
        onSubmit={encryptWithPassword}
        onCancel={() => setIsEncrypting(false)}
      />
    </PopupDialog>
  );
}
