import { csv2json } from "json-2-csv";

import { type EncryptedEnvelope, isEncryptedEnvelope } from "./crypto-envelope";
import { isWalletRows } from "./walletRows";
import type { WalletRow } from "../types/wallet";

export const BackupKind = {
  ROWS: "rows",
  ENCRYPTED: "encrypted",
} as const;

export type Backup =
  | { kind: typeof BackupKind.ROWS; rows: WalletRow[] }
  | { kind: typeof BackupKind.ENCRYPTED; envelope: EncryptedEnvelope };

/** Reads a backup file's text, throwing when it is neither format */
export function readBackup(filename: string, content: string): Backup {
  const isCsv = filename.toLowerCase().endsWith(".csv");
  const data = isCsv
    ? csv2json(content, {
        trimHeaderFields: true,
        trimFieldValues: true,
        parseValue: (value) => value,
      })
    : JSON.parse(content);

  if (isEncryptedEnvelope(data)) {
    return { kind: BackupKind.ENCRYPTED, envelope: data };
  }

  if (!isWalletRows(data)) {
    throw new Error("Invalid backup file");
  }

  return { kind: BackupKind.ROWS, rows: data };
}
