import "../../lib/polyfill.ts";

import { createWalletWorker } from "../../lib/worker.ts";
import { generateMnemonicPhrase } from "../mnemonic.ts";

createWalletWorker(() => generateMnemonicPhrase(12));
