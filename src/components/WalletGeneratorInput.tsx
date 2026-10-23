import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi2";

import Input from "./Input";
import LabelToggle from "./LabelToggle";
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

const NumberInputButton = (props: React.ComponentProps<"button">) => (
  <button
    {...props}
    className={cn(
      "bg-neutral-700",
      "flex items-center justify-center",
      "p-1 px-3 rounded-lg",
    )}
  />
);

export default function WalletGeneratorInput({
  generate,
  isGenerating,
  count,
  setCount,
  supportsTestnet = false,
  isTestnet,
  setIsTestnet,
}: WalletGeneratorInputProps) {
  const stepCount = (step: number) =>
    setCount(clampCount((parseCount(count) ?? MIN_WALLET_COUNT) + step));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          name="count"
          placeholder="Count"
          value={count}
          onChange={(ev) => setCount(ev.target.value)}
          type="number"
          inputMode="numeric"
          min={MIN_WALLET_COUNT}
          max={MAX_WALLET_COUNT}
          step={1}
        />
        <div className="flex gap-1 shrink-0">
          <NumberInputButton
            aria-label="Decrease count"
            title="Decrease count"
            onClick={() => stepCount(-1)}
          >
            <HiOutlineMinus className="size-4 stroke-3" />
          </NumberInputButton>
          <NumberInputButton
            aria-label="Increase count"
            title="Increase count"
            onClick={() => stepCount(1)}
          >
            <HiOutlinePlus className="size-4 stroke-3" />
          </NumberInputButton>
        </div>

        <button
          onClick={generate}
          disabled={isGenerating}
          className={cn(
            "px-4 py-2 rounded-xl bg-yellow-500 text-black shrink-0",
            "disabled:opacity-60",
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
