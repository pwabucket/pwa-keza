import { DropdownMenu } from "radix-ui";
import { HiOutlineCheck, HiOutlineEllipsisVertical } from "react-icons/hi2";
import { useEffect } from "react";
import { useLocationToggle } from "@pwabucket/pwa-router";

import IconButton from "../ui/IconButton";
import useListActions from "../../hooks/useListActions";
import { cn } from "../../lib/utils";

const ITEM_CLASS = cn(
  "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer",
  "outline-hidden data-highlighted:bg-neutral-600",
);

/** Menu holding the list actions on narrow toolbars */
export default function ListActionsMenu({ hidden }: { hidden: boolean }) {
  const [isOpen, setIsOpen] = useLocationToggle("wallet-list-menu");

  /* The toolbar grew wide enough to show the actions inline */
  useEffect(() => {
    if (hidden && isOpen) setIsOpen(false);
  }, [hidden, isOpen, setIsOpen]);
  const {
    expanded,
    revealAll,
    toggleExpanded,
    toggleRevealAll,
    copyAll,
    openPrint,
  } = useListActions();

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <IconButton
          label="More actions"
          className={cn(
            "bg-neutral-600 px-3 py-2 rounded-xl",
            hidden && "hidden",
          )}
        >
          <HiOutlineEllipsisVertical className="size-4" />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className="z-40 min-w-48 p-1 rounded-xl bg-neutral-700 shadow-lg"
        >
          <DropdownMenu.CheckboxItem
            checked={expanded}
            onCheckedChange={toggleExpanded}
            className={ITEM_CLASS}
          >
            <span className="grow">Expand values</span>
            <DropdownMenu.ItemIndicator>
              <HiOutlineCheck className="size-4" />
            </DropdownMenu.ItemIndicator>
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            checked={revealAll}
            onCheckedChange={toggleRevealAll}
            className={ITEM_CLASS}
          >
            <span className="grow">Reveal secrets</span>
            <DropdownMenu.ItemIndicator>
              <HiOutlineCheck className="size-4" />
            </DropdownMenu.ItemIndicator>
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Item onSelect={copyAll} className={ITEM_CLASS}>
            Copy All
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={openPrint} className={ITEM_CLASS}>
            Print
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
