import toast from "react-hot-toast";

import { parseUrl } from "./url";

const SAFE_URL = parseUrl(import.meta.env.VITE_SAFE_URL);

/** How long to wait for Safe to report that it is ready */
const SAFE_READY_TIMEOUT = 60_000;

/** Cleans up the handoff that is waiting for Safe, if any */
let stopPendingHandoff: (() => void) | null = null;

export function openSafe(entry: {
  type: "file";
  filename: string;
  content: File;
}) {
  if (!SAFE_URL) {
    toast.error("Safe is not configured.");
    return;
  }

  const safeWindow = window.open(SAFE_URL, "_blank");

  if (!safeWindow) {
    toast.error("Allow pop-ups to open Safe.");
    return;
  }

  /* Only one handoff waits at a time */
  stopPendingHandoff?.();

  const safeOrigin = SAFE_URL.origin;

  function handleSafeReady(event: MessageEvent) {
    if (event.origin !== safeOrigin) return;
    if (event.source !== safeWindow) return;
    if (event.data === "ready") {
      safeWindow!.postMessage(entry, safeOrigin);
      stop();
    }
  }

  function stop() {
    window.clearTimeout(timeout);
    window.removeEventListener("message", handleSafeReady);
    stopPendingHandoff = null;
  }

  const timeout = window.setTimeout(stop, SAFE_READY_TIMEOUT);

  window.addEventListener("message", handleSafeReady);
  stopPendingHandoff = stop;
}
