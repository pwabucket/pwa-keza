import { useCallback, useMemo } from "react";
import { useLocationState } from "@pwabucket/pwa-router";

import FieldDialog, { type FieldTarget } from "./FieldDialog";
import PrintDialog from "../print/PrintDialog";
import PrintView from "../print/PrintView";
import type { PrintOptions } from "../print/printOptions";
import usePrint from "../../hooks/usePrint";
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

  const [isPrinting, setIsPrinting] = useLocationState(
    "wallet-print",
    false,
    DIALOG_STATE_OPTIONS,
  );
  const { job: printJob, print } = usePrint();

  const actions = useMemo(
    () => ({
      openField: (index: number, label: string) => setField({ index, label }),
      openDownload: (target: DownloadTarget) => setDownload(target),
      openPrint: () => setIsPrinting(true),
    }),
    [setField, setDownload, setIsPrinting],
  );

  const closeField = useCallback(() => setField(undefined), [setField]);
  const closeDownload = useCallback(
    () => setDownload(undefined),
    [setDownload],
  );
  const closePrint = useCallback(
    () => setIsPrinting(undefined),
    [setIsPrinting],
  );
  const printAndClose = useCallback(
    (options: PrintOptions) => {
      print(options);
      closePrint();
    },
    [print, closePrint],
  );

  return (
    <WalletDialogsContext.Provider value={actions}>
      {children}
      <FieldDialog target={field} onClose={closeField} />
      <WalletDownloadDialog target={download} onClose={closeDownload} />
      <PrintDialog
        open={isPrinting}
        onClose={closePrint}
        onPrint={printAndClose}
      />
      {printJob ? <PrintView job={printJob} /> : null}
    </WalletDialogsContext.Provider>
  );
}
