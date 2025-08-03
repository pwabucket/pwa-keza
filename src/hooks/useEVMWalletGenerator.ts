import EVMWorker from "../workers/EVMWorker?worker";
import useWalletWorker from "./useWalletWorker";
import type { generateEVMWallet } from "../wallets/evm";
export default function useEVMWalletGenerator() {
  return useWalletWorker<typeof generateEVMWallet>(EVMWorker);
}
