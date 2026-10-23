import { cn } from "../../lib/utils";

type IconButtonProps = React.ComponentProps<"button"> & {
  /** Accessible name, also shown as the tooltip */
  label: string;
};

/** Icon-only button with an accessible name; sizing comes from className */
export default function IconButton({
  label,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "shrink-0 flex items-center justify-center",
        "disabled:opacity-60",
        "focus-visible:outline-hidden focus-visible:ring-3",
        "focus-visible:ring-yellow-300",
        className,
      )}
    />
  );
}
