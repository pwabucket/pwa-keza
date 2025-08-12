import { createWalletWorker } from "../lib/worker";
import { generateEVMWallet } from "../wallets/evm";

createWalletWorker(generateEVMWallet);
