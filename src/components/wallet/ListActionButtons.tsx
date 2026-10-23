import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCopyOutline,
} from "react-icons/io5";
import {
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlinePrinter,
} from "react-icons/hi2";

import IconButton from "../ui/IconButton";
import useListActions from "../../hooks/useListActions";
import { cn } from "../../lib/utils";

const BUTTON_CLASS = "bg-neutral-600 px-3 py-2 rounded-xl";

/** The list actions as inline buttons, for toolbars with room */
export default function ListActionButtons({
  className,
}: {
  className?: string;
}) {
  const {
    expanded,
    revealAll,
    toggleExpanded,
    toggleRevealAll,
    copyAll,
    openPrint,
  } = useListActions();

  return (
    <div className={cn("gap-2 shrink-0", className)}>
      <IconButton
        label="Expand values"
        aria-pressed={expanded}
        onClick={toggleExpanded}
        className={BUTTON_CLASS}
      >
        {expanded ? (
          <IoChevronUpOutline className="size-4" />
        ) : (
          <IoChevronDownOutline className="size-4" />
        )}
      </IconButton>

      <IconButton
        label="Reveal secrets"
        aria-pressed={revealAll}
        onClick={toggleRevealAll}
        className={BUTTON_CLASS}
      >
        {revealAll ? (
          <HiOutlineEyeSlash className="size-4" />
        ) : (
          <HiOutlineEye className="size-4" />
        )}
      </IconButton>

      <IconButton label="Copy All" onClick={copyAll} className={BUTTON_CLASS}>
        <IoCopyOutline className="size-4" />
      </IconButton>

      <IconButton label="Print" onClick={openPrint} className={BUTTON_CLASS}>
        <HiOutlinePrinter className="size-4" />
      </IconButton>
    </div>
  );
}
