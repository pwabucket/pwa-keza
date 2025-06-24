import toast from "react-hot-toast";
import { csv2json } from "json-2-csv";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import InnerAppLayout from "../layouts/InnerAppLayout";
import RestoreIcon from "../assets/images/restore.svg";
import WalletList from "../components/WalletList";
import useWallets from "../hooks/useWallets";
import { cn } from "../lib/utils";

export default function Restore() {
  const { wallets, expanded, setWallets, setExpanded } = useWallets();
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        try {
          if (file.type === "text/csv") {
            const data = csv2json(e.target.result, {
              trimHeaderFields: true,
              trimFieldValues: true,
            });

            setWallets(data);
          } else {
            const data = JSON.parse(e.target.result);
            setWallets(data);
          }
        } catch {
          toast.error("Invalid Backup file!");
        }
      });
      reader.readAsText(file);
    },
    [setWallets]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
      "text/plain": [".txt"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <InnerAppLayout
      headerMiddleContent={
        <div className="flex justify-center items-center gap-2">
          <img src={RestoreIcon} className="size-8" />{" "}
          <h1 className="font-bold">Restore Wallets</h1>
        </div>
      }
      className="gap-4"
    >
      {wallets.length > 0 ? (
        <WalletList
          id={"restored"}
          wallets={wallets}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border border-dashed border-yellow-500",
            "px-4 py-10 text-center rounded-xl",
            "text-yellow-500"
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
      )}
    </InnerAppLayout>
  );
}
