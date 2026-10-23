import * as Comlink from "comlink";

interface PooledWorker<API> {
  worker: Worker;
  api: Comlink.Remote<API>;
}

/**
 * Lazily created, size-capped set of Comlink workers.
 * Workers are created on demand and terminated once the pool has been idle.
 */
export class WorkerPool<API> {
  private readonly createWorker: () => Worker;
  private readonly maxSize: number;
  private readonly idleTimeout: number;
  private workers: PooledWorker<API>[] = [];
  private activeJobs = 0;
  private idleTimer = 0;

  constructor(
    createWorker: () => Worker,
    maxSize: number,
    idleTimeout: number,
  ) {
    this.createWorker = createWorker;
    this.maxSize = maxSize;
    this.idleTimeout = idleTimeout;
  }

  /** Returns up to `size` workers for a job, creating any that are missing */
  acquire(size: number): Comlink.Remote<API>[] {
    window.clearTimeout(this.idleTimer);
    this.activeJobs++;

    const target = Math.min(Math.max(size, 1), this.maxSize);

    while (this.workers.length < target) {
      const worker = this.createWorker();
      this.workers.push({ worker, api: Comlink.wrap<API>(worker) });
    }

    return this.workers.slice(0, target).map(({ api }) => api);
  }

  /** Marks a job as finished; the pool shuts down after the idle timeout */
  release() {
    this.activeJobs = Math.max(this.activeJobs - 1, 0);

    if (this.activeJobs === 0) {
      window.clearTimeout(this.idleTimer);
      this.idleTimer = window.setTimeout(
        () => this.terminate(),
        this.idleTimeout,
      );
    }
  }

  /** Stops every worker immediately, including ones mid-job */
  terminate() {
    window.clearTimeout(this.idleTimer);

    for (const { worker } of this.workers) {
      worker.terminate();
    }

    this.workers = [];
    this.activeJobs = 0;
  }
}
