import { memo } from "react";

import { GeneratorMode } from "./generatorMode";
import { cn } from "../../lib/utils";

const MODES = [
  { mode: GeneratorMode.GENERATE, label: "New wallets" },
  { mode: GeneratorMode.DERIVE, label: "From phrase" },
];

/** Switches between generating new wallets and deriving from a phrase */
export default memo(function GeneratorModeSwitch({
  mode,
  onChange,
}: {
  mode: GeneratorMode;
  onChange: (mode: GeneratorMode) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Wallet source"
      className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-neutral-700"
    >
      {MODES.map((item) => (
        <button
          key={item.mode}
          role="radio"
          aria-checked={mode === item.mode}
          onClick={() => onChange(item.mode)}
          className={cn(
            "px-3 py-1.5 rounded-lg min-w-0 truncate",
            "focus-visible:outline-hidden focus-visible:ring-3",
            "focus-visible:ring-yellow-300",
            mode === item.mode
              ? "bg-yellow-500 text-black font-bold"
              : "text-neutral-300",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
});
