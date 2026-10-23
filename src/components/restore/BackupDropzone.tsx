import toast from "react-hot-toast";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import useSession from "../../hooks/useSession";
import { cn } from "../../lib/utils";
import { detectModule } from "../../lib/restore/detect";
import { parseBackup } from "../../lib/backup";

const ACCEPTED_FILES = {
  "application/json": [".json"],
  "text/plain": [".txt"],
  "text/csv": [".csv"],
};

/** Reads a backup file into the session and detects its wallet type */
export default function BackupDropzone() {
  const setRows = useSession((state) => state.setRows);
  const setModule = useSession((state) => state.setModule);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) {
        toast.error("Choose a .json, .txt or .csv backup file.", {
          id: "restore",
        });
        return;
      }

      try {
        const rows = parseBackup(file.name, await file.text());

        setModule(detectModule(rows, file.name));
        setRows(rows, false);
      } catch {
        toast.error("Invalid Backup file!", { id: "restore" });
      }
    },
    [setRows, setModule],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILES,
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border border-dashed border-yellow-500",
        "px-4 py-10 text-center rounded-xl",
        "text-yellow-500",
        "focus-visible:outline-hidden focus-visible:ring-3",
        "focus-visible:ring-yellow-300",
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the backup file here ...</p>
      ) : (
        <p>
          Drag 'n' drop the backup file here, or click to select backup file
        </p>
      )}
    </div>
  );
}
