import { csv2json } from "json-2-csv";

export type WalletRow = Record<string, string>;

/** Checks that the data is a non-empty list of flat string records */
function isWalletRows(data: unknown): data is WalletRow[] {
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

/** Parses a backup file's text into wallet rows, throwing when it is invalid */
export function parseBackup(filename: string, content: string): WalletRow[] {
  const isCsv = filename.toLowerCase().endsWith(".csv");
  const data = isCsv
    ? csv2json(content, {
        trimHeaderFields: true,
        trimFieldValues: true,
        parseValue: (value) => value,
      })
    : JSON.parse(content);

  if (!isWalletRows(data)) {
    throw new Error("Invalid backup file");
  }

  return data;
}
