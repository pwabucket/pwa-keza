import { cn } from "../lib/utils";

export default function AppContainer(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "grow w-full min-w-0 min-h-0 max-w-md mx-auto p-4",
        "flex flex-col",
        props.className
      )}
    />
  );
}
