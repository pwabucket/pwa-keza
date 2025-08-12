import { createWalletWorker } from "../lib/worker";
import { generateSolanaWallet } from "../wallets/solana";

createWalletWorker(generateSolanaWallet);
