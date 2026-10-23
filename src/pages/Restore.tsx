import toast from "react-hot-toast";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import HeaderTitle from "../layouts/HeaderTitle";
import InnerAppLayout from "../layouts/InnerAppLayout";
import RestoreIcon from "../assets/images/restore.svg";
import WalletList from "../components/WalletList";
import useWallets from "../hooks/useWallets";
import { cn } from "../lib/utils";
import { parseBackup } from "../lib/backup";
import type { WalletModule } from "../types/wallet";
import { walletModulesById } from "../wallets/registry";

export default function Restore() {
  const { wallets, expanded, setWallets, setExpanded } = useWallets();
  const [module, setModule] = useState<WalletModule | null>(null);
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
        setWallets(parseBackup(file.name, await file.text()));
      } catch {
        toast.error("Invalid Backup file!", { id: "restore" });
        return;
      }

      /* Detect module from file name */
      const moduleId = file.name.replace("keza-", "").split("-wallet")[0];

      /* Find module */
      const detectedModule = walletModulesById.get(moduleId);

      if (detectedModule) {
        setModule(detectedModule);
        setExpanded(detectedModule.defaultExpanded ?? false);
      } else {
        setModule(null);
      }
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
        <HeaderTitle icon={RestoreIcon}>Restore Wallets</HeaderTitle>
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
