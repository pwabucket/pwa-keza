import toast from "react-hot-toast";
import { registerSW } from "virtual:pwa-register";

/** Registers the service worker; updates wait until the user reloads */
export function registerServiceWorker() {
  const updateSW = registerSW({
    immediate: true,
    onOfflineReady() {
      toast.success("Ready to work offline.", { id: "sw-offline" });
    },
    onNeedRefresh() {
      toast(
        (t) => (
          <span className="flex items-center gap-3">
            A new version is available.
            <button
              onClick={() => {
                toast.dismiss(t.id);
                updateSW(true);
              }}
              className="px-3 py-1 rounded-lg bg-yellow-500 text-black shrink-0"
            >
              Reload
            </button>
          </span>
        ),
        { id: "sw-update", duration: Infinity },
      );
    },
  });
}
