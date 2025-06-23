import AppContainer from "./AppContainer";
import Header from "./Header";
import { cn } from "../lib/utils";
export default function AppLayout({
  headerLeftContent,
  headerMiddleContent,
  headerRightContent,
  headerTitle,
  ...props
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header
        leftContent={headerLeftContent}
        middleContent={
          headerMiddleContent ||
          (headerTitle ? (
            <h2
              className={cn(
                "text-center truncate",
                "flex gap-2 items-center justify-center font-bold"
              )}
            >
              {headerTitle}
            </h2>
          ) : null)
        }
        rightContent={headerRightContent}
      />
      <AppContainer {...props} />
    </div>
  );
}
