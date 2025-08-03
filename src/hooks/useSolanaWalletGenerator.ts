import SolanaWorker from "../workers/SolanaWorker?worker";
import useWalletWorker from "./useWalletWorker";
import type { generateSolanaWallet } from "../wallets/solana";

export default function useSolanaWalletGenerator() {
  return useWalletWorker<typeof generateSolanaWallet>(SolanaWorker);
}
