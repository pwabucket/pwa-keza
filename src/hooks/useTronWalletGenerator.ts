import TronWorker from "../workers/TronWorker?worker";
import useWalletWorker from "./useWalletWorker";
import type { generateTronWallet } from "../wallets/tron";

export default function useTronWalletGenerator() {
  return useWalletWorker<typeof generateTronWallet>(TronWorker);
}
