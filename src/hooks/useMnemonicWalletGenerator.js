import { useCallback } from "react";

import MnemonicWorker from "../workers/MnemonicWorker?worker";
import useWalletWorker from "./useWalletWorker";

export default function useMnemonicWalletGenerator(strength = 12) {
  const generate = useWalletWorker(MnemonicWorker);

  return useCallback(
    (count) => generate(count, strength),
    [strength, generate]
  );
}
