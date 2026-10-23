import toast from "react-hot-toast";
import { useCallback, useState } from "react";
import { useLocationToggle } from "@pwabucket/pwa-router";

import useSession from "./useSession";
import { BackupKind, readBackup } from "../lib/backup";
import { type EncryptedEnvelope, decryptBackup } from "../lib/crypto-envelope";
import { detectModule } from "../lib/restore/detect";
import { walletModulesById } from "../wallets/registry";
import type { WalletRow } from "../types/wallet";

/** Loads a backup file into the session, asking for a password if needed */
export default function useRestoreBackup() {
  const setRows = useSession((state) => state.setRows);
  const setModule = useSession((state) => state.setModule);
  const [isAskingPassword, setIsAskingPassword] =
    useLocationToggle("decrypt-password");

  /* Kept in memory only; history state never holds backup contents */
  const [pending, setPending] = useState<{
    filename: string;
    envelope: EncryptedEnvelope;
  } | null>(null);

  const applyRows = useCallback(
    (rows: WalletRow[], filename: string, moduleId?: string | null) => {
      const module =
        (moduleId ? walletModulesById.get(moduleId) : undefined) ??
        detectModule(rows, filename);

      setModule(module);
      setRows(rows, false);
    },
    [setRows, setModule],
  );

  const restoreFile = useCallback(
    async (file: File) => {
      try {
        const backup = readBackup(file.name, await file.text());

        if (backup.kind === BackupKind.ENCRYPTED) {
          setPending({ filename: file.name, envelope: backup.envelope });
          setIsAskingPassword(true);
        } else {
          applyRows(backup.rows, file.name);
        }
      } catch {
        toast.error("Invalid Backup file!", { id: "restore" });
      }
    },
    [applyRows, setIsAskingPassword],
  );

  const decrypt = useCallback(
    async (password: string) => {
      if (!pending) return;

      let payload;

      try {
        payload = await decryptBackup(pending.envelope, password);
      } catch {
        throw new Error("Wrong password, or the file is damaged.");
      }

      setPending(null);
      setIsAskingPassword(false);
      applyRows(payload.rows, pending.filename, payload.moduleId);
    },
    [pending, applyRows, setIsAskingPassword],
  );

  const cancelDecrypt = useCallback(() => {
    setPending(null);
    setIsAskingPassword(false);
  }, [setIsAskingPassword]);

  return {
    restoreFile,
    isAskingPassword: isAskingPassword && pending !== null,
    decrypt,
    cancelDecrypt,
  };
}
