import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

import Input from "./Input";
import { cn } from "../lib/utils";
import LabelToggle from "./LabelToggle";

type WalletGeneratorInputProps = {
  generate: () => void;
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
      "p-1 px-3 rounded-lg"
    )}
  />
);

export default function WalletGeneratorInput({
  generate,
  count,
  setCount,
  supportsTestnet = false,
  isTestnet,
  setIsTestnet,
}: WalletGeneratorInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          placeholder="Count"
          value={count}
          onChange={(ev) => setCount(ev.target.value)}
          type="number"
          inputMode="numeric"
        />
        <div className="flex gap-1 shrink-0">
          <NumberInputButton
            onClick={() => setCount(parseInt(count as string) - 1)}
          >
            <HiOutlineChevronLeft className="size-4 stroke-3" />
          </NumberInputButton>
          <NumberInputButton
            onClick={() => setCount(parseInt(count as string) + 1)}
          >
            <HiOutlineChevronRight className="size-4 stroke-3" />
          </NumberInputButton>
        </div>

        <button
          onClick={generate}
          className="px-4 py-2 rounded-xl bg-yellow-500 text-black shrink-0"
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
