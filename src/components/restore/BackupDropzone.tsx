import toast from "react-hot-toast";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import PasswordDialog from "../ui/PasswordDialog";
import useRestoreBackup from "../../hooks/useRestoreBackup";
import { cn } from "../../lib/utils";

const ACCEPTED_FILES = {
  "application/json": [".json"],
  "text/plain": [".txt"],
  "text/csv": [".csv"],
};

/** Reads a backup file into the session and detects its wallet type */
export default function BackupDropzone() {
  const { restoreFile, isAskingPassword, decrypt, cancelDecrypt } =
    useRestoreBackup();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        restoreFile(file);
      } else {
        toast.error("Choose a .json, .txt or .csv backup file.", {
          id: "restore",
        });
      }
    },
    [restoreFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILES,
    maxFiles: 1,
    multiple: false,
  });

  return (
    <>
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

      <PasswordDialog
        open={isAskingPassword}
        title="Encrypted backup"
        description="Enter the password this backup was encrypted with."
        submitLabel="Decrypt"
        onSubmit={decrypt}
        onCancel={cancelDecrypt}
      />
    </>
  );
}
