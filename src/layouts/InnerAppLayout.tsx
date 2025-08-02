import AppLayout from "./AppLayout";
import { HeaderReturnButton } from "./HeaderButton";

export default function InnerAppLayout(
  props: React.ComponentProps<typeof AppLayout>
) {
  return <AppLayout {...props} headerLeftContent={<HeaderReturnButton />} />;
}
