const SAFE_URL = import.meta.env.VITE_SAFE_URL;

export function openSafe(entry: {
  type: "file";
  filename: string;
  content: File;
}) {
  window.open(SAFE_URL, "_blank");

  function handleSafeReady(event: MessageEvent) {
    if (event.origin !== new URL(SAFE_URL).origin) return;
    if (event.data === "ready") {
      event.source!.postMessage(entry, SAFE_URL);
      window.removeEventListener("message", handleSafeReady);
    }
  }

  window.addEventListener("message", handleSafeReady);
}
