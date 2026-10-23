import { Virtuoso } from "react-virtuoso";
import { useCallback, useMemo, useRef } from "react";

import Input from "../Input";
import WalletCard from "./WalletCard";
import WalletDialogs from "./WalletDialogs";
import WalletToolbar from "./WalletToolbar";
import useHotkeys from "../../hooks/useHotkeys";
import useSession from "../../hooks/useSession";
import useWalletSearch from "../../hooks/useWalletSearch";
import { getSecretLabels } from "../../wallets/secrets";

/** The session's wallets with a toolbar, search and a virtualized list */
export default function WalletList() {
  const rows = useSession((state) => state.rows);
  const expanded = useSession((state) => state.expanded);
  const revealAll = useSession((state) => state.revealAll);
  const module = useSession((state) => state.module);
  const unsaved = useSession((state) => state.unsaved);
  const { query, handleQueryChange, matches } = useWalletSearch(rows);
  const searchRef = useRef<HTMLInputElement>(null);

  useHotkeys({ "/": () => searchRef.current?.focus() });

  const secretLabels = useMemo(() => getSecretLabels(module), [module]);
  const fields = module?.fieldsByLabel ?? null;

  /* Position in the shown list to position in the full list */
  const toIndex = useCallback(
    (position: number) => (matches ? matches[position] : position),
    [matches],
  );

  const computeItemKey = useCallback(
    (position: number) => toIndex(position),
    [toIndex],
  );

  const itemContent = useCallback(
    (position: number) => {
      const index = toIndex(position);

      return (
        <div className="pb-4">
          <WalletCard
            index={index}
            row={rows[index]}
            expanded={expanded}
            secretLabels={secretLabels}
            fields={fields}
            revealAll={revealAll}
          />
        </div>
      );
    },
    [toIndex, rows, expanded, secretLabels, fields, revealAll],
  );

  const shownCount = matches ? matches.length : rows.length;

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
          onChange={handleQueryChange}
        />
        {/* Only search results are announced; the count changes constantly while generating */}
        <p className="text-center" aria-live={query ? "polite" : "off"}>
          <span className="font-bold">{query ? "Results" : "Wallets"}:</span>{" "}
          {shownCount}
        </p>
      </div>

      <div className="flex flex-col">
        <Virtuoso
          useWindowScroll
          totalCount={shownCount}
          computeItemKey={computeItemKey}
          itemContent={itemContent}
        />
      </div>
    </WalletDialogs>
  );
}
