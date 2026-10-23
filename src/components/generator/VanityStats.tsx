import { memo } from "react";

import useElapsedSeconds from "../../hooks/useElapsedSeconds";
import { cn } from "../../lib/utils";
import { getHalfChanceSeconds } from "../../lib/vanity";

const numberFormat = new Intl.NumberFormat();
const compactFormat = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Seconds as a short duration, e.g. "3 min" or "2.5 h" */
function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) return "—";
  if (seconds < 60) return `${Math.ceil(seconds)} s`;
  if (seconds < 3600) return `${compactFormat.format(seconds / 60)} min`;
  if (seconds < 86400) return `${compactFormat.format(seconds / 3600)} h`;
  return `${compactFormat.format(seconds / 86400)} days`;
}

type VanityStatsProps = {
  attempts: number;
  startedAt: number;
  difficulty: number | null;
  onStop: () => void;
  className?: string;
};

/** Tries so far, speed and the expected wait for a running search */
export default memo(function VanityStats({
  attempts,
  startedAt,
  difficulty,
  onStop,
  className,
}: VanityStatsProps) {
  const seconds = useElapsedSeconds(startedAt);
  const rate = seconds > 0 ? attempts / seconds : 0;
  const halfChance =
    difficulty && rate > 0 ? getHalfChanceSeconds(difficulty, rate) : Infinity;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-3 rounded-xl bg-neutral-700",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <p className="grow min-w-0 font-bold" aria-live="polite">
          Searching...
        </p>
        <button
          onClick={onStop}
          className={cn(
            "px-3 py-1 rounded-lg bg-neutral-600 shrink-0",
            "focus-visible:outline-hidden focus-visible:ring-3",
            "focus-visible:ring-yellow-300",
          )}
        >
          Stop
        </button>
      </div>
      <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-neutral-300">
        <dt>Tries</dt>
        <dd className="text-right">{numberFormat.format(attempts)}</dd>
        <dt>Speed</dt>
        <dd className="text-right">
          {numberFormat.format(Math.round(rate))}/s
        </dd>
        <dt>Even chance in</dt>
        <dd className="text-right">{formatDuration(halfChance)}</dd>
      </dl>
    </div>
  );
});
