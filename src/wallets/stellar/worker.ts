import { createWalletWorker } from "../../lib/worker";
import { generateStellarWallet } from "./generator";

createWalletWorker(generateStellarWallet);
