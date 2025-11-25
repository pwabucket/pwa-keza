import { createWalletWorker } from "../../lib/worker";
import { generateEVMWallet } from "./generator";

createWalletWorker(generateEVMWallet);
