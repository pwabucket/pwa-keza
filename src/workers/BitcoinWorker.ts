import "../lib/polyfill.ts";

import { createWalletWorker } from "../lib/worker.ts";
import { generateBitcoinWallet } from "../wallets/bitcoin.ts";

createWalletWorker(generateBitcoinWallet);
