import toast from "react-hot-toast";
import { csv2json } from "json-2-csv";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import InnerAppLayout from "../layouts/InnerAppLayout";
import RestoreIcon from "../assets/images/restore.svg";
import WalletList from "../components/WalletList";
import useWallets from "../hooks/useWallets";
import { cn } from "../lib/utils";
import type { WalletModule } from "../types/wallet";

import generators from "../wallets";

export default function Restore() {
  const { wallets, expanded, setWallets, setExpanded } = useWallets();
  const [module, setModule] = useState<WalletModule | null>(null);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        try {
          if (file.type === "text/csv") {
            const data = csv2json(e.target?.result as string, {
              trimHeaderFields: true,
              trimFieldValues: true,
            }) as Record<string, string>[];

            setWallets(data);
          } else {
            const data = JSON.parse(e.target?.result as string) as Record<
              string,
              string
            >[];

            setWallets(data);
          }

          /* Detect module from file name */
          const moduleId = file.name.replace("keza-", "").split("-wallet")[0];

          /* Debug log */
          console.log("Detected module ID:", moduleId);

          /* Find module */
          const detectedModule = generators.find((mod) => {
            return mod.id === moduleId;
          });

          if (detectedModule) {
            setModule(detectedModule);
            setExpanded(detectedModule.defaultExpanded ?? false);
          } else {
            setModule(null);
          }
        } catch {
          toast.error("Invalid Backup file!");
        }
      });
      reader.readAsText(file);
    },
    [setWallets, setExpanded]
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
        <div>
          <WalletList
            id={"restored"}
            wallets={wallets}
            expanded={expanded}
            setExpanded={setExpanded}
            getParcelConfig={module?.getParcelConfig}
          />
        </div>
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
