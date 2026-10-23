import toast from "react-hot-toast";
import { memo, useCallback, useState } from "react";

import LabelToggle from "./LabelToggle";
import NumberStepper from "./ui/NumberStepper";
import useHotkeys from "../hooks/useHotkeys";
import { cn } from "../lib/utils";
import {
  MAX_WALLET_COUNT,
  MIN_WALLET_COUNT,
  clampCount,
  parseCount,
} from "../lib/count";
import type { WalletGeneratorOptions } from "../types/wallet";

type WalletGeneratorInputProps = {
  onGenerate: (count: number, options: WalletGeneratorOptions) => void;
  isGenerating: boolean;
  supportsTestnet: boolean;
};

/** Count, testnet switch and Generate button; owns its own input state */
export default memo(function WalletGeneratorInput({
  onGenerate,
  isGenerating,
  supportsTestnet,
}: WalletGeneratorInputProps) {
  const [count, setCount] = useState<string | number>(1);
  const [isTestnet, setIsTestnet] = useState(false);

  const stepCount = useCallback(
    (step: number) =>
      setCount((prev) =>
        clampCount((parseCount(prev) ?? MIN_WALLET_COUNT) + step),
      ),
    [],
  );

  const generate = useCallback(() => {
    if (isGenerating) return;

    const parsedCount = parseCount(count);

    if (parsedCount === null || parsedCount < MIN_WALLET_COUNT) {
      toast.error("Enter how many wallets to generate.", { id: "count" });
      return;
    }

    const total = clampCount(parsedCount);

    setCount(total);
    onGenerate(total, { testnet: isTestnet });
  }, [count, isTestnet, isGenerating, onGenerate]);

  useHotkeys({ g: generate });

  return (
    <div className="flex flex-col gap-2">
      {/* Wraps the Generate button onto its own line on narrow screens */}
      <div className="flex flex-wrap gap-2">
        <NumberStepper
          label="Count"
          value={count}
          min={MIN_WALLET_COUNT}
          max={MAX_WALLET_COUNT}
          onChange={setCount}
          onStep={stepCount}
          className="grow-999 basis-40"
        />

        <button
          onClick={generate}
          disabled={isGenerating}
          aria-keyshortcuts="G"
          className={cn(
            "px-4 py-2 rounded-xl bg-yellow-500 text-black grow",
            "disabled:opacity-60",
            "focus-visible:outline-hidden focus-visible:ring-3",
            "focus-visible:ring-yellow-300",
          )}
        >
          Generate
        </button>
      </div>

      {supportsTestnet && (
        <div className="flex items-center justify-center gap-2">
          <LabelToggle
            checked={isTestnet}
            onChange={() => setIsTestnet((prev) => !prev)}
          >
            Testnet
          </LabelToggle>
        </div>
      )}
    </div>
  );
});
