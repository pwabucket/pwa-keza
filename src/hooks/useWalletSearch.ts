import { useCallback, useDeferredValue, useMemo, useState } from "react";

import type { WalletRow } from "../types/wallet";

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

/**
 * Filters wallets by any of their values. Returns the positions of the
 * matching wallets, or null when there is no query and every wallet shows.
 */
export default function useWalletSearch(rows: WalletRow[]) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setQuery(event.target.value),
    [],
  );

  const matches = useMemo<number[] | null>(() => {
    const needle = deferredQuery.trim().toLowerCase();

    if (!needle) return null;

    const found: number[] = [];

    rows.forEach((row, index) => {
      if (getSearchText(row).includes(needle)) found.push(index);
    });

    return found;
  }, [rows, deferredQuery]);

  return { query, handleQueryChange, matches };
}
