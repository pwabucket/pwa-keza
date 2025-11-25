import "../../lib/polyfill.ts";

import { createWalletWorker } from "../../lib/worker.ts";
import { generateTONWallet } from "./generator.ts";

createWalletWorker(generateTONWallet);
