import "../lib/polyfill.ts";

import { createWalletWorker } from "./createWalletWorker";
import { generateBitcoinWallet } from "../wallets/bitcoin.ts";

createWalletWorker(generateBitcoinWallet);
