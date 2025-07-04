import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

import Input from "./Input";
import { cn } from "../lib/utils";

const NumberInputButton = (props) => (
  <button
    {...props}
    className={cn(
      "bg-neutral-700",
      "flex items-center justify-center",
      "p-1 px-3 rounded-lg"
    )}
  />
);

export default function WalletGeneratorInput({ generate, count, setCount }) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Count"
        value={count}
        onChange={(ev) => setCount(ev.target.value)}
      />
      <div className="flex gap-1 shrink-0">
        <NumberInputButton onClick={() => setCount(parseInt(count) - 1)}>
          <HiOutlineChevronLeft className="size-4 stroke-3" />
        </NumberInputButton>
        <NumberInputButton onClick={() => setCount(parseInt(count) + 1)}>
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
  );
}
