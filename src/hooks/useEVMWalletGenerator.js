import { Wallet } from "ethers";
import { useCallback } from "react";

export default function useEVMWalletGenerator() {
  return useCallback(async () => {
    const wallet = Wallet.createRandom();
    return {
      ["Address"]: wallet.address,
      ["Public Key"]: wallet.publicKey,
      ["Private Key"]: wallet.privateKey,
      ["Phrase"]: wallet.mnemonic.phrase,
    };
  }, []);
}
