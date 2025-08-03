import "../lib/polyfill.ts";

import { createWalletWorker } from "./createWalletWorker";
import { generateTONWallet } from "../wallets/ton.ts";

createWalletWorker(generateTONWallet);
