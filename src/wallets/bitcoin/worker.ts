import "../../lib/polyfill.ts";

import { createWalletWorker } from "../../lib/worker.ts";
import { generateBitcoinWallet } from "./generator.ts";

createWalletWorker(generateBitcoinWallet);
