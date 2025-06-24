import { memo } from "react";

import { cn } from "../lib/utils";

export default memo(function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        "bg-neutral-700",
        "px-4 py-2 rounded-lg font-bold w-full min-h-0 min-w-0",
        "focus:outline-hidden focus:ring-3 focus:ring-yellow-300",
        "disabled:opacity-50",
        props.className
      )}
    />
  );
});
