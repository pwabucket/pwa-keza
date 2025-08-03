import { createWalletWorker } from "./createWalletWorker";
import { generateEVMWallet } from "../wallets/evm";

createWalletWorker(generateEVMWallet);
