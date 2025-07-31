import EVMWorker from "../workers/EVMWorker?worker";
import useWalletWorker from "./useWalletWorker";
export default function useEVMWalletGenerator() {
  return useWalletWorker(EVMWorker);
}
