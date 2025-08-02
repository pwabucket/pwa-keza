import AppContainer from "./AppContainer";
import Header from "./Header";
import { cn } from "../lib/utils";

type AppLayoutProps = React.ComponentProps<typeof AppContainer> & {
  headerLeftContent?: React.ReactNode;
  headerMiddleContent?: React.ReactNode;
  headerRightContent?: React.ReactNode;
  headerTitle?: string;
};

export default function AppLayout({
  headerLeftContent,
  headerMiddleContent,
  headerRightContent,
  headerTitle,
  ...props
}: AppLayoutProps) {
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
