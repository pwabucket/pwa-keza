import { memo, useMemo } from "react";

import { GeneratorMode } from "./generatorMode";
import { cn } from "../../lib/utils";
import type { WalletModule } from "../../types/wallet";

/** Short labels keep three modes on one row at 240px */
const MODES = [
  { mode: GeneratorMode.GENERATE, label: "New", name: "New wallets" },
  { mode: GeneratorMode.DERIVE, label: "Phrase", name: "From phrase" },
  { mode: GeneratorMode.VANITY, label: "Vanity", name: "Vanity address" },
];

/** Switches between the ways a module can produce wallets */
export default memo(function GeneratorModeSwitch({
  module,
  mode,
  onChange,
}: {
  module: WalletModule;
  mode: GeneratorMode;
  onChange: (mode: GeneratorMode) => void;
}) {
  const modes = useMemo(
    () =>
      MODES.filter(
        (item) =>
          (item.mode !== GeneratorMode.DERIVE || module.derive) &&
          (item.mode !== GeneratorMode.VANITY || module.vanity),
      ),
    [module],
  );

  return (
    <div
      role="radiogroup"
      aria-label="Wallet source"
      className="flex gap-1 p-1 rounded-xl bg-neutral-700"
    >
      {modes.map((item) => (
        <button
          key={item.mode}
          role="radio"
          aria-checked={mode === item.mode}
          aria-label={item.name}
          title={item.name}
          onClick={() => onChange(item.mode)}
          className={cn(
            "basis-0 grow px-3 py-1.5 rounded-lg min-w-0 truncate",
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
