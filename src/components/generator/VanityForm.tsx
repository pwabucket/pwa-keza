import { memo, useCallback } from "react";

import Input from "../Input";
import LabelToggle from "../LabelToggle";
import VanityStats from "./VanityStats";
import useHotkeys from "../../hooks/useHotkeys";
import useVanityForm from "../../hooks/useVanityForm";
import { LetterCase } from "../../wallets/vanity";
import { cn } from "../../lib/utils";
import type { VanityCapability } from "../../types/wallet";
import type { VanityMatcher } from "../../lib/vanity";
import type { VanityStats as Stats } from "../../hooks/useVanitySearch";

const numberFormat = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

type VanityFormProps = {
  capability: VanityCapability;
  onSearch: (matcher: VanityMatcher) => void;
  onStop: () => void;
  /** This form's search is running */
  isSearching: boolean;
  /** Any job on the page is running */
  isRunning: boolean;
  stats: Stats;
};

/** Finds an address that starts and/or ends with chosen characters */
export default memo(function VanityForm({
  capability,
  onSearch,
  onStop,
  isSearching,
  isRunning,
  stats,
}: VanityFormProps) {
  const form = useVanityForm(capability);
  const { buildMatcher } = form;

  const submit = useCallback(() => {
    if (isRunning) return;

    const matcher = buildMatcher();
    if (matcher) onSearch(matcher);
  }, [isRunning, buildMatcher, onSearch]);

  useHotkeys({ g: submit });

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className="flex flex-wrap gap-2">
        <label className="flex flex-col gap-1 grow basis-32 min-w-0">
          <span className="text-xs font-bold text-neutral-300">
            Starts with
          </span>
          <div className="flex items-center gap-1 min-w-0">
            {capability.fixedPrefix ? (
              <span className="font-mono font-bold text-neutral-400 shrink-0">
                {capability.fixedPrefix}
              </span>
            ) : null}
            <Input
              value={form.prefix}
              onChange={form.handlePrefixChange}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              disabled={isRunning}
              className="font-mono"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1 grow basis-32 min-w-0">
          <span className="text-xs font-bold text-neutral-300">Ends with</span>
          <Input
            value={form.suffix}
            onChange={form.handleSuffixChange}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            disabled={isRunning}
            className="font-mono"
          />
        </label>
      </div>

      {capability.letterCase === LetterCase.MIXED ? (
        <div className="flex justify-center">
          <LabelToggle
            checked={form.matchCase}
            onChange={form.toggleMatchCase}
            disabled={isRunning}
          >
            Match case
          </LabelToggle>
        </div>
      ) : null}

      <p className="text-xs text-center text-neutral-300" aria-live="polite">
        {form.difficulty
          ? `About 1 in ${numberFormat.format(form.difficulty)} addresses match.`
          : (form.error ?? "")}
      </p>

      <button
        type="submit"
        disabled={isRunning}
        aria-keyshortcuts="G"
        className={cn(
          "px-4 py-2 rounded-xl bg-yellow-500 text-black",
          "disabled:opacity-60",
          "focus-visible:outline-hidden focus-visible:ring-3",
          "focus-visible:ring-yellow-300",
        )}
      >
        Find address
      </button>

      {isSearching ? (
        <VanityStats
          attempts={stats.attempts}
          startedAt={stats.startedAt}
          difficulty={form.difficulty}
          onStop={onStop}
        />
      ) : null}

      <p className="text-xs text-yellow-400 text-center">
        Vanity wallets have no recovery phrase. Back up the private key.
      </p>
    </form>
  );
});
