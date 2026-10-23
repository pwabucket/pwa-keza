import WalletWorker from "./wallet.worker?worker";
import { WorkerPool } from "./pool";
import { getMaxWorkers } from "./capacity";
import type { WalletWorkerAPI } from "./protocol";

/** How long idle workers are kept warm, in milliseconds */
const IDLE_TIMEOUT = 30_000;

export const walletPool = new WorkerPool<WalletWorkerAPI>(
  () => new WalletWorker(),
  getMaxWorkers(),
  IDLE_TIMEOUT,
);

/* Free the workers when the page is unloaded or put in the back/forward cache */
window.addEventListener("pagehide", () => walletPool.terminate());
