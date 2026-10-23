import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi2";
import { memo, useCallback } from "react";

import IconButton from "./IconButton";
import Input from "../Input";
import { cn } from "../../lib/utils";

type NumberStepperProps = {
  label: string;
  value: string | number;
  min: number;
  max: number;
  onChange: (value: string | number) => void;
  /** Steps the value by the given amount, clamped to the range */
  onStep: (step: number) => void;
  className?: string;
};

/** Number input with decrease and increase buttons */
export default memo(function NumberStepper({
  label,
  value,
  min,
  max,
  onChange,
  onStep,
  className,
}: NumberStepperProps) {
  const decrease = useCallback(() => onStep(-1), [onStep]);
  const increase = useCallback(() => onStep(1), [onStep]);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value),
    [onChange],
  );

  return (
    <div className={cn("flex gap-2 min-w-0", className)}>
      <Input
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={handleChange}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={1}
        className="min-w-16 grow"
      />
      <div className="flex gap-1 shrink-0">
        <IconButton
          label={`Decrease ${label.toLowerCase()}`}
          onClick={decrease}
          className="bg-neutral-700 p-1 px-3 rounded-lg"
        >
          <HiOutlineMinus className="size-4 stroke-3" />
        </IconButton>
        <IconButton
          label={`Increase ${label.toLowerCase()}`}
          onClick={increase}
          className="bg-neutral-700 p-1 px-3 rounded-lg"
        >
          <HiOutlinePlus className="size-4 stroke-3" />
        </IconButton>
      </div>
    </div>
  );
});
