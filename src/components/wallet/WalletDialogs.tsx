import { useCallback, useMemo } from "react";
import { useLocationState } from "@pwabucket/pwa-router";

import FieldDialog, { type FieldTarget } from "./FieldDialog";
import WalletDownloadDialog from "./WalletDownloadDialog";
import {
  type DownloadTarget,
  WalletDialogsContext,
} from "../../contexts/WalletDialogsContext";

/* Dropped after a reload, since the wallets they point at are gone */
const DIALOG_STATE_OPTIONS = { persist: false };

/**
 * Owns the field and download dialogs for every wallet in the list.
 * Only this component follows the location, so wallet rows don't re-render
 * when a dialog opens or closes.
 */
export default function WalletDialogs({
  children,
}: {
  children: React.ReactNode;
}) {
  const [field, setField] = useLocationState<FieldTarget | null>(
    "wallet-field",
    null,
    DIALOG_STATE_OPTIONS,
  );
  const [download, setDownload] = useLocationState<DownloadTarget | null>(
    "wallet-download",
    null,
    DIALOG_STATE_OPTIONS,
  );

  const actions = useMemo(
    () => ({
      openField: (index: number, label: string) => setField({ index, label }),
      openDownload: (target: DownloadTarget) => setDownload(target),
    }),
    [setField, setDownload],
  );

  const closeField = useCallback(() => setField(undefined), [setField]);
  const closeDownload = useCallback(
    () => setDownload(undefined),
    [setDownload],
  );

  return (
    <WalletDialogsContext.Provider value={actions}>
      {children}
      <FieldDialog target={field} onClose={closeField} />
      <WalletDownloadDialog target={download} onClose={closeDownload} />
    </WalletDialogsContext.Provider>
  );
}
