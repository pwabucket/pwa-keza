import { cn } from "../../lib/utils";

/** Fixed-length placeholder, so a hidden value doesn't reveal its length */
const MASK = "••••••••••••••••";

/** A wallet value, shown as dots until revealed */
export default function MaskedValue({
  value,
  revealed,
  expanded,
}: {
  value: string;
  revealed: boolean;
  expanded: boolean;
}) {
  if (!revealed) {
    return (
      <p className="font-bold font-mono truncate text-neutral-300">
        <span aria-hidden="true">{MASK}</span>
        <span className="sr-only">Hidden</span>
      </p>
    );
  }

  return (
    <p
      className={cn("font-bold font-mono", expanded ? "break-all" : "truncate")}
    >
      {value}
    </p>
  );
}
