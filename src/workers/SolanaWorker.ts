import { createWalletWorker } from "./createWalletWorker";
import { generateSolanaWallet } from "../wallets/solana";

createWalletWorker(generateSolanaWallet);
