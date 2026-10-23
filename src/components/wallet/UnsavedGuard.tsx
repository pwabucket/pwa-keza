import ConfirmDialog from "../ui/ConfirmDialog";
import useUnsavedGuard from "../../hooks/useUnsavedGuard";

/** Confirms leaving the page while generated wallets aren't exported */
export default function UnsavedGuard() {
  const { isPrompting, stay, leave } = useUnsavedGuard();

  return (
    <ConfirmDialog
      open={isPrompting}
      title="Leave without saving?"
      description="Your wallets haven't been downloaded. They will be lost if you leave."
      confirmLabel="Leave"
      cancelLabel="Stay"
      onConfirm={leave}
      onCancel={stay}
    />
  );
}
