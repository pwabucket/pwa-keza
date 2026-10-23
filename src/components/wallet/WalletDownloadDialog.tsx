import { Dialog } from "radix-ui";
import { useCallback, useMemo } from "react";

import DownloadDialog from "../DownloadDialog";
import useSession from "../../hooks/useSession";
import type { DownloadTarget } from "../../contexts/WalletDialogsContext";

/** File name prefix for wallets whose module is unknown */
const UNKNOWN_MODULE_ID = "restored";

/** Download dialog for all wallets or one of them */
export default function WalletDownloadDialog({
  target,
  onClose,
}: {
  target: DownloadTarget | null;
  onClose: () => void;
}) {
  const moduleId = useSession((state) => state.module?.id) ?? UNKNOWN_MODULE_ID;
  const markSaved = useSession((state) => state.markSaved);
  const rows = useSession((state) => state.rows);
  const data = useMemo(() => {
    if (target === null) return null;
    if (target === "all") return rows;

    const row = rows[target];
    return row ? [row] : null;
  }, [target, rows]);

  /* Only exporting every wallet counts as saving the session */
  const handleExport = useCallback(() => {
    if (target === "all") markSaved();
  }, [target, markSaved]);

  const filename =
    target === "all"
      ? `${moduleId}-wallets`
      : `${moduleId}-wallet-${(target ?? 0) + 1}`;

  return (
    <Dialog.Root
      open={data !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      {data ? (
        <DownloadDialog
          data={data}
          filename={filename}
          onExport={handleExport}
        />
      ) : null}
    </Dialog.Root>
  );
}
