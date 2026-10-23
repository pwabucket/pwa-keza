import { createContext } from "react";

/** Which wallets a download covers: one wallet's index, or all of them */
export type DownloadTarget = number | "all";

export interface WalletDialogsActions {
  /** Opens the QR code dialog for one field of one wallet */
  openField: (index: number, label: string) => void;
  openDownload: (target: DownloadTarget) => void;
  openPrint: () => void;
}

/** Stable openers for the shared wallet dialogs */
export const WalletDialogsContext = createContext<WalletDialogsActions | null>(
  null,
);
