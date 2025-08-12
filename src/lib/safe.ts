const SAFE_URL = import.meta.env.VITE_SAFE_URL;

export function openSafe(entry: {
  type: "file";
  filename: string;
  content: File;
}) {
  const safeWindow = window.open(SAFE_URL, "_blank");

  function handleSafeReady(event: MessageEvent) {
    if (event.origin !== SAFE_URL) return;
    if (event.data === "ready") {
      safeWindow!.postMessage(entry, SAFE_URL);
      window.removeEventListener("message", handleSafeReady);
    }
  }

  window.addEventListener("message", handleSafeReady);
}
