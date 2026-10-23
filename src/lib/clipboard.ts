import toast from "react-hot-toast";

/** How long a copied secret stays on the clipboard, in milliseconds */
const SECRET_CLEAR_DELAY = 30_000;

/**
 * Events that count as a user gesture. Safari and Firefox only allow
 * clipboard writes during one, so a blocked clear is retried on the next.
 */
const GESTURE_EVENTS = ["pointerup", "keydown"] as const;

/** A copied secret waiting to be cleared */
interface PendingClear {
  timer: number;
  /** Removes the gesture listeners of a clear that was blocked */
  stopRetry?: () => void;
}

/** The latest copied secret; only this one may still be cleared */
let pendingClear: PendingClear | null = null;

function cancelPendingClear() {
  if (!pendingClear) return;

  window.clearTimeout(pendingClear.timer);
  pendingClear.stopRetry?.();
  pendingClear = null;
}

/** Empties the clipboard, unless something has been copied since */
async function clearClipboard(entry: PendingClear) {
  if (pendingClear !== entry) return;

  try {
    await navigator.clipboard.writeText("");

    if (pendingClear === entry) pendingClear = null;
  } catch {
    if (pendingClear === entry) retryOnNextGesture(entry);
  }
}

/** Tries the clear again during the user's next tap or key press */
function retryOnNextGesture(entry: PendingClear) {
  const retry = () => {
    stop();
    clearClipboard(entry);
  };
  const stop = () => {
    for (const type of GESTURE_EVENTS) {
      window.removeEventListener(type, retry, true);
    }
  };

  for (const type of GESTURE_EVENTS) {
    window.addEventListener(type, retry, true);
  }

  entry.stopRetry = stop;
}

/**
 * Copies text. A secret is cleared from the clipboard after a while, unless
 * something else has been copied from the app since.
 */
export async function copyToClipboard(
  text: string,
  { secret = false }: { secret?: boolean } = {},
) {
  cancelPendingClear();

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    toast.error("Couldn't copy. Allow clipboard access and try again.", {
      id: "copy",
    });
    return;
  }

  if (secret) {
    const entry: PendingClear = { timer: 0 };

    entry.timer = window.setTimeout(
      () => clearClipboard(entry),
      SECRET_CLEAR_DELAY,
    );
    pendingClear = entry;

    toast.success("Copied! It will be cleared from the clipboard soon.", {
      id: "copy",
    });
  } else {
    toast.success("Copied!", { id: "copy" });
  }
}
