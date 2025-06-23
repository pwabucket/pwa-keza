import AppLayout from "./AppLayout";
import { HeaderReturnButton } from "./HeaderButton";

export default function InnerAppLayout(props) {
  return <AppLayout {...props} headerLeftContent={<HeaderReturnButton />} />;
}
