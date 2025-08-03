import { useCallback } from "react";

import MnemonicWorker from "../workers/MnemonicWorker?worker";
import useWalletWorker from "./useWalletWorker";
import type { generateMnemonicPhrase } from "../wallets/mnemonic";

export default function useMnemonicWalletGenerator(strength: 12 | 24 = 12) {
  const generate =
    useWalletWorker<typeof generateMnemonicPhrase>(MnemonicWorker);

  return useCallback(
    (count: number) => generate(count, strength),
    [strength, generate]
  );
}
