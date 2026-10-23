import type { WalletRow } from "../types/wallet";

/** Checks that the data is a non-empty list of flat string records */
export function isWalletRows(data: unknown): data is WalletRow[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (row) =>
        typeof row === "object" &&
        row !== null &&
        !Array.isArray(row) &&
        Object.values(row).every((value) => typeof value === "string"),
    )
  );
}
