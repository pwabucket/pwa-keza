import "../lib/polyfill.ts";
import { createWalletWorker } from "../lib/worker.ts";
import { generateTronWallet } from "../wallets/tron.ts";

createWalletWorker(generateTronWallet);
