import { cn } from "../lib/utils";
import { memo } from "react";

import Toggle from "./Toggle";

export default memo(function LabelToggle({
  children,
  ...props
}: React.ComponentProps<"input"> & { children: React.ReactNode }) {
  return (
    <label
      className={cn(
        "flex items-center gap-4 cursor-pointer rounded-xl",
        "has-[input:disabled]:opacity-60"
      )}
    >
      <h4 className="min-w-0 min-h-0 grow font-bold">{children}</h4>{" "}
      <Toggle {...props} />
    </label>
  );
});
