import { Virtuoso } from "react-virtuoso";
import { useCallback, useRef } from "react";

import Input from "../Input";
import WalletCard from "./WalletCard";
import WalletDialogs from "./WalletDialogs";
import WalletToolbar from "./WalletToolbar";
import useHotkeys from "../../hooks/useHotkeys";
import useSession from "../../hooks/useSession";
import useWalletSearch, { type WalletEntry } from "../../hooks/useWalletSearch";

const computeItemKey = (_: number, entry: WalletEntry) => entry.index;

/** The session's wallets with a toolbar, search and a virtualized list */
export default function WalletList() {
  const rows = useSession((state) => state.rows);
  const expanded = useSession((state) => state.expanded);
  const unsaved = useSession((state) => state.unsaved);
  const { query, setQuery, entries } = useWalletSearch(rows);
  const searchRef = useRef<HTMLInputElement>(null);

  useHotkeys({ "/": () => searchRef.current?.focus() });

  const itemContent = useCallback(
    (_: number, entry: WalletEntry) => (
      <div className="pb-4">
        <WalletCard index={entry.index} row={entry.row} expanded={expanded} />
      </div>
    ),
    [expanded],
  );

  return (
    <WalletDialogs>
      <WalletToolbar />

      {unsaved ? (
        <div className="p-4 pt-0">
          <p className="text-xs text-yellow-400 text-center">
            ⚠️ Ensure to download and securely store your wallets before closing
            this page.
          </p>
        </div>
      ) : null}

      {/* Search */}
      <div className="flex flex-col mb-4 gap-2">
        <Input
          ref={searchRef}
          name="search"
          type="search"
          aria-keyshortcuts="/"
          aria-label="Search wallets"
          placeholder="Search wallets"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="text-center" aria-live="polite">
          <span className="font-bold">{query ? "Results" : "Wallets"}:</span>{" "}
          {entries.length}
        </p>
      </div>

      <div className="flex flex-col">
        <Virtuoso
          useWindowScroll
          data={entries}
          computeItemKey={computeItemKey}
          itemContent={itemContent}
        />
      </div>
    </WalletDialogs>
  );
}
