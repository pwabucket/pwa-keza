import { useDeferredValue, useMemo, useState } from "react";

import type { WalletRow } from "../types/wallet";

export interface WalletEntry {
  /** Position in the full list, kept when the list is filtered */
  index: number;
  row: WalletRow;
}

/* Rows keep their identity while the list grows, so each is lowercased once */
const searchTextCache = new WeakMap<WalletRow, string>();

/** Lowercase text of every value in a wallet */
function getSearchText(row: WalletRow) {
  let text = searchTextCache.get(row);

  if (text === undefined) {
    text = Object.values(row).join("\n").toLowerCase();
    searchTextCache.set(row, text);
  }

  return text;
}

/** Filters wallets by any of their values, keeping each wallet's position */
export default function useWalletSearch(rows: WalletRow[]) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const entries = useMemo<WalletEntry[]>(() => {
    const needle = deferredQuery.trim().toLowerCase();
    const all = rows.map((row, index) => ({ row, index }));

    if (!needle) return all;

    return all.filter(({ row }) => getSearchText(row).includes(needle));
  }, [rows, deferredQuery]);

  return { query, setQuery, entries };
}
