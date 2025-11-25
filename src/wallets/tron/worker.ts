import "../../lib/polyfill.ts";
import { createWalletWorker } from "../../lib/worker.ts";
import { generateTronWallet } from "./generator.ts";

createWalletWorker(generateTronWallet);
