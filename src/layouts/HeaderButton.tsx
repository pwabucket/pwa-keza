import type { DynamicComponentProps } from "../types/types";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { cn } from "../lib/utils";
import { useNavigateBack } from "@pwabucket/pwa-router";

export function HeaderButton({
  as,
  icon,
  label,
  ...props
}: DynamicComponentProps<"button"> & {
  icon: React.ElementType;
  label: string;
}) {
  const Component = as || "button";
  const Icon = icon;

  return (
    <Component
      {...props}
      aria-label={label}
      title={label}
      className={cn(
        "size-10 rounded-full",
        "flex justify-center items-center",
        "hover:bg-neutral-700",
        "focus-visible:outline-hidden focus-visible:ring-3",
        "focus-visible:ring-yellow-300",
        props.className,
      )}
    >
      <Icon className="size-6" />
    </Component>
  );
}

export function HeaderReturnButton(
  props: Omit<React.ComponentProps<typeof HeaderButton>, "icon" | "label">,
) {
  const navigateBack = useNavigateBack();

  return (
    <HeaderButton
      {...props}
      label="Go back"
      onClick={() => navigateBack()}
      icon={HiOutlineArrowLeft}
    />
  );
}
