import "../lib/polyfill.ts";

import { createWalletWorker } from "../lib/worker.ts";
import { generateTONWallet } from "../wallets/ton.ts";

createWalletWorker(generateTONWallet);
