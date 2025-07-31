import useWalletWorker from "./useWalletWorker";
import SolanaWorker from "../workers/SolanaWorker?worker";

export default function useSolanaWalletGenerator() {
  return useWalletWorker(SolanaWorker);
}
