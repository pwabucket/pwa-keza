import type { DynamicComponentProps } from "../types/types";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { cn } from "../lib/utils";
import { useNavigateBack } from "@pwabucket/pwa-router";

export function HeaderButton({
  as,
  icon,
  ...props
}: DynamicComponentProps<"button"> & {
  icon: React.ElementType;
}) {
  const Component = as || "button";
  const Icon = icon;

  return (
    <Component
      {...props}
      className={cn(
        "size-10 rounded-full",
        "flex justify-center items-center",
        "hover:bg-neutral-700",
        props.className,
      )}
    >
      <Icon className="size-6" />
    </Component>
  );
}

export function HeaderReturnButton(
  props: Omit<React.ComponentProps<typeof HeaderButton>, "icon">,
) {
  const navigateBack = useNavigateBack();

  return (
    <HeaderButton
      {...props}
      onClick={() => navigateBack()}
      icon={HiOutlineArrowLeft}
    />
  );
}
