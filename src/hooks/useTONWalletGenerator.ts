import TONWorker from "../workers/TONWorker?worker";
import useWalletWorker from "./useWalletWorker";
import type { generateTONWallet } from "../wallets/ton";

export default function useTONWalletGenerator() {
  return useWalletWorker<typeof generateTONWallet>(TONWorker);
}
