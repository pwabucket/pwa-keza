import StellarWorker from "../workers/StellarWorker?worker";
import useWalletWorker from "./useWalletWorker";
import type { generateStellarWallet } from "../wallets/stellar";

export default function useStellarWalletGenerator() {
  return useWalletWorker<typeof generateStellarWallet>(StellarWorker);
}
