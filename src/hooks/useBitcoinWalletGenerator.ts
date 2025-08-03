import BitcoinWorker from "../workers/BitcoinWorker?worker";
import useWalletWorker from "./useWalletWorker";
import type { generateBitcoinWallet } from "../wallets/bitcoin";

export default function useBitcoinWalletGenerator() {
  return useWalletWorker<typeof generateBitcoinWallet>(BitcoinWorker);
}
