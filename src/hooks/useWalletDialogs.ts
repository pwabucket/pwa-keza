import { useContext } from "react";

import { WalletDialogsContext } from "../contexts/WalletDialogsContext";

/** Openers for the shared wallet dialogs */
export default function useWalletDialogs() {
  const actions = useContext(WalletDialogsContext);

  if (!actions) {
    throw new Error("useWalletDialogs must be used inside WalletDialogs");
  }

  return actions;
}
