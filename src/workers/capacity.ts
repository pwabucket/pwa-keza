/** Workers allowed per GB of device memory */
const WORKERS_PER_GB = 2;

/** Assumed memory when the browser doesn't report it (Firefox, Safari) */
const DEFAULT_MEMORY_GB = 4;

/** Assumed cores when the browser doesn't report them */
const DEFAULT_CORES = 2;

/** Device Memory API, only available in Chromium browsers */
type NavigatorWithMemory = Navigator & { deviceMemory?: number };

/**
 * Most workers this device can run: one per core, leaving one for the page,
 * and no more than its memory can hold.
 */
export function getMaxWorkers() {
  const cores = navigator.hardwareConcurrency || DEFAULT_CORES;
  const memory =
    (navigator as NavigatorWithMemory).deviceMemory ?? DEFAULT_MEMORY_GB;

  const coreLimit = cores - 1;
  const memoryLimit = Math.floor(memory * WORKERS_PER_GB);

  return Math.max(Math.min(coreLimit, memoryLimit), 1);
}
