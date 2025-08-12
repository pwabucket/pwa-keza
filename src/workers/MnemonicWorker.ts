import "../lib/polyfill.ts";

import { createWalletWorker } from "../lib/worker.ts";
import { generateMnemonicPhrase } from "../wallets/mnemonic.ts";

createWalletWorker(generateMnemonicPhrase);
