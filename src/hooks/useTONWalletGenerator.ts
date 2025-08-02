import TONWorker from "../workers/TONWorker?worker";
import useWalletWorker from "./useWalletWorker";

export default function useTONWalletGenerator() {
  return useWalletWorker(TONWorker);
}
