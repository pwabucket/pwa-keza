import "../lib/polyfill.ts";

import { createWalletWorker } from "./createWalletWorker";
import { generateMnemonicPhrase } from "../wallets/mnemonic.ts";

createWalletWorker(generateMnemonicPhrase);
