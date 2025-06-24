import { generateMnemonic } from "bip39";
import { useCallback } from "react";

export default function useMnemonicWalletGenerator(strength = 12) {
  return useCallback(async () => {
    let mnemonic = generateMnemonic(strength === 12 ? 128 : 256);

    return {
      ["Phrase"]: mnemonic,
    };
  }, [strength]);
}
