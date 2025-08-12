import { createWalletWorker } from "../lib/worker";
import { generateStellarWallet } from "../wallets/stellar";

createWalletWorker(generateStellarWallet);
