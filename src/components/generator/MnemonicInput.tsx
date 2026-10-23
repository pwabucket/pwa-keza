import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { memo, useState } from "react";

import IconButton from "../ui/IconButton";
import { cn } from "../../lib/utils";

/** Recovery phrase field, masked by default and kept out of autofill */
export default memo(function MnemonicInput({
  value,
  onChange,
  wordCount,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  wordCount: number;
  disabled?: boolean;
}) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <textarea
          aria-label="Recovery phrase"
          placeholder="Recovery phrase"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          rows={3}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={cn(
            "grow min-w-0 resize-none",
            "bg-neutral-700 px-4 py-2 rounded-lg font-bold font-mono",
            "focus:outline-hidden focus:ring-3 focus:ring-yellow-300",
            "disabled:opacity-50",
            !isRevealed && "[-webkit-text-security:disc]",
          )}
        />
        <IconButton
          label={isRevealed ? "Hide phrase" : "Show phrase"}
          aria-pressed={isRevealed}
          onClick={() => setIsRevealed((prev) => !prev)}
          className="bg-neutral-700 p-2 rounded-lg"
        >
          {isRevealed ? (
            <HiOutlineEyeSlash className="size-4" />
          ) : (
            <HiOutlineEye className="size-4" />
          )}
        </IconButton>
      </div>
      <p className="text-xs text-neutral-400" aria-live="polite">
        {wordCount} {wordCount === 1 ? "word" : "words"}
      </p>
    </div>
  );
});
