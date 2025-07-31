import StellarWorker from "../workers/StellarWorker?worker";
import useWalletWorker from "./useWalletWorker";

export default function useStellarWalletGenerator() {
  return useWalletWorker(StellarWorker);
}
