import { memo } from "react";

import { cn } from "../lib/utils";
import useElapsedSeconds from "../hooks/useElapsedSeconds";

const numberFormat = new Intl.NumberFormat();

type JobProgressProps = {
  done: number;
  total: number;
  startedAt: number;
  onStop: () => void;
  className?: string;
};

/** Progress bar with counts, rate and a Stop button for a running job */
export default memo(function JobProgress({
  done,
  total,
  startedAt,
  onStop,
  className,
}: JobProgressProps) {
  const seconds = useElapsedSeconds(startedAt);
  const rate = seconds > 0 ? Math.round(done / seconds) : 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-3 rounded-xl bg-neutral-700",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <progress
          value={done}
          max={total}
          aria-label="Generating wallets"
          className={cn(
            "grow min-w-0 h-2 rounded-full overflow-hidden appearance-none",
            "bg-neutral-600 [&::-webkit-progress-bar]:bg-neutral-600",
            "[&::-webkit-progress-value]:bg-yellow-500",
            "[&::-moz-progress-bar]:bg-yellow-500",
          )}
        />
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
      <p
        className="flex flex-wrap justify-between gap-x-2 text-xs text-neutral-300"
      >
        <span>
          {numberFormat.format(done)} / {numberFormat.format(total)}
        </span>
        <span>{numberFormat.format(rate)}/s</span>
      </p>
    </div>
  );
});
