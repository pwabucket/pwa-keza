import { createWalletWorker } from "./createWalletWorker";
import { generateStellarWallet } from "../wallets/stellar";

createWalletWorker(generateStellarWallet);
