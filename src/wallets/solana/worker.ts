import { createWalletWorker } from "../../lib/worker";
import { generateSolanaWallet } from "./generator";

createWalletWorker(generateSolanaWallet);
