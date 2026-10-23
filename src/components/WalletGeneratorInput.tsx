import { useCallback } from "react";

import LabelToggle from "./LabelToggle";
import NumberStepper from "./ui/NumberStepper";
import { cn } from "../lib/utils";
import {
  MAX_WALLET_COUNT,
  MIN_WALLET_COUNT,
  clampCount,
  parseCount,
} from "../lib/count";

type WalletGeneratorInputProps = {
  generate: () => void;
  isGenerating: boolean;
  count: string | number;
  supportsTestnet: boolean;
  isTestnet: boolean;
  setIsTestnet: React.Dispatch<React.SetStateAction<boolean>>;
  setCount: React.Dispatch<React.SetStateAction<string | number>>;
};

export default function WalletGeneratorInput({
  generate,
  isGenerating,
  count,
  setCount,
  supportsTestnet = false,
  isTestnet,
  setIsTestnet,
}: WalletGeneratorInputProps) {
  const stepCount = useCallback(
    (step: number) =>
      setCount((prev) =>
        clampCount((parseCount(prev) ?? MIN_WALLET_COUNT) + step),
      ),
    [setCount],
  );

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
            onChange={() => setIsTestnet(!isTestnet)}
          >
            Testnet
          </LabelToggle>
        </div>
      )}
    </div>
  );
}
