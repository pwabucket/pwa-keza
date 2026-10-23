import toast from "react-hot-toast";
import { useCallback, useRef } from "react";
import { useLocationToggle } from "@pwabucket/pwa-router";

import useSessionStore from "./useSessionStore";
import useWalletJob, { type JobResult } from "./useWalletJob";
import { JobStatus } from "../workers/protocol";
import type { WalletGeneratorOptions } from "../types/wallet";

const numberFormat = new Intl.NumberFormat();

interface GenerateRequest {
  count: number;
  options: WalletGeneratorOptions;
}

/** Tells the user how a finished job went */
function reportJobResult({ status, count, error }: JobResult, total: number) {
  switch (status) {
    case JobStatus.DONE:
      toast.success(`Generated ${numberFormat.format(count)} wallets.`, {
        id: "job",
      });
      break;
    case JobStatus.CANCELLED:
      toast(
        `Stopped at ${numberFormat.format(count)} of ${numberFormat.format(total)}.`,
        { id: "job" },
      );
      break;
    case JobStatus.FAILED:
      toast.error(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
        { id: "job" },
      );
      break;
  }
}

/** Generates wallets, asking first when unsaved wallets would be replaced */
export default function useGenerateWallets(moduleId: string) {
  const store = useSessionStore();
  const { status, progress, start, cancel } = useWalletJob(moduleId);
  const [isConfirming, setIsConfirming] =
    useLocationToggle("regenerate-confirm");
  const pendingRef = useRef<GenerateRequest | null>(null);

  const run = useCallback(
    async ({ count, options }: GenerateRequest) => {
      const result = await start(count, options);

      if (result) {
        reportJobResult(result, count);
      }
    },
    [start],
  );

  const generate = useCallback(
    (count: number, options: WalletGeneratorOptions) => {
      const { unsaved, rows } = store.getState();

      if (unsaved && rows.length > 0) {
        pendingRef.current = { count, options };
        setIsConfirming(true);
      } else {
        run({ count, options });
      }
    },
    [store, run, setIsConfirming],
  );

  const confirmReplace = useCallback(() => {
    const pending = pendingRef.current;

    pendingRef.current = null;
    setIsConfirming(false);

    if (pending) {
      run(pending);
    }
  }, [run, setIsConfirming]);

  const cancelReplace = useCallback(() => {
    pendingRef.current = null;
    setIsConfirming(false);
  }, [setIsConfirming]);

  return {
    status,
    progress,
    generate,
    cancel,
    isConfirming,
    confirmReplace,
    cancelReplace,
  };
}
