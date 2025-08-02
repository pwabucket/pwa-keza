import BitcoinWorker from "../workers/BitcoinWorker?worker";
import useWalletWorker from "./useWalletWorker";

export default function useBitcoinWalletGenerator() {
  return useWalletWorker(BitcoinWorker);
}
