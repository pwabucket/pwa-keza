import toast from "react-hot-toast";

/** How long a copied secret stays on the clipboard, in milliseconds */
const SECRET_CLEAR_DELAY = 30_000;

/** The secret waiting to be cleared, if any */
let pendingClear: { timer: number; stopRetry?: () => void } | null = null;

function cancelPendingClear() {
  if (!pendingClear) return;

  window.clearTimeout(pendingClear.timer);
  pendingClear.stopRetry?.();
  pendingClear = null;
}

/**
 * Empties the clipboard. Browsers only allow it while the page has focus,
 * so a failed attempt waits for the page to be focused again.
 */
async function clearClipboard() {
  try {
    await navigator.clipboard.writeText("");
    pendingClear = null;
  } catch {
    const retry = () => {
      if (document.hasFocus()) {
        stop();
        clearClipboard();
      }
    };
    const stop = () => {
      window.removeEventListener("focus", retry);
      document.removeEventListener("visibilitychange", retry);
    };

    window.addEventListener("focus", retry);
    document.addEventListener("visibilitychange", retry);

    if (pendingClear) pendingClear.stopRetry = stop;
  }
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
    pendingClear = {
      timer: window.setTimeout(clearClipboard, SECRET_CLEAR_DELAY),
    };
    toast.success("Copied! The clipboard clears in 30 seconds.", {
      id: "copy",
    });
  } else {
    toast.success("Copied!", { id: "copy" });
  }
}
