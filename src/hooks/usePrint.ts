import { flushSync } from "react-dom";
import { useCallback, useEffect, useState } from "react";

import type { PrintJob, PrintOptions } from "../components/print/printOptions";

/**
 * Renders the print view, opens the browser's print dialog and removes the
 * view again once printing is done or cancelled.
 */
export default function usePrint() {
  const [job, setJob] = useState<PrintJob | null>(null);

  useEffect(() => {
    if (!job) return;

    const clear = () => setJob(null);

    window.addEventListener("afterprint", clear, { once: true });
    return () => window.removeEventListener("afterprint", clear);
  }, [job]);

  const print = useCallback((options: PrintOptions) => {
    /* The view must be in the page before the print dialog takes its snapshot */
    flushSync(() => setJob({ ...options, printedAt: Date.now() }));
    window.print();
  }, []);

  return { job, print };
}
