import toast from "react-hot-toast";
import { useCallback, useRef } from "react";
import { useLocationToggle } from "@pwabucket/pwa-router";

import useSessionStore from "./useSessionStore";
import useWalletJob, { type JobResult } from "./useWalletJob";
import { type DeriveJob, JobStatus } from "../workers/protocol";
import type { WalletGeneratorOptions } from "../types/wallet";

const numberFormat = new Intl.NumberFormat();

const RequestKind = {
  GENERATE: "generate",
  DERIVE: "derive",
} as const;

type WalletRequest =
  | {
      kind: typeof RequestKind.GENERATE;
      count: number;
      options: WalletGeneratorOptions;
    }
  | { kind: typeof RequestKind.DERIVE; job: Omit<DeriveJob, "moduleId"> };

/** Tells the user how a finished job went */
function reportJobResult(
  { status, count, error }: JobResult,
  total: number,
  verb: string,
) {
  switch (status) {
    case JobStatus.DONE:
      toast.success(`${verb} ${numberFormat.format(count)} wallets.`, {
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
      toast.error(error instanceof Error ? error.message : String(error), {
        id: "job",
      });
      break;
  }
}

/**
 * Generates or derives wallets, asking first when unsaved wallets would be
 * replaced.
 */
export default function useGenerateWallets(moduleId: string) {
  const store = useSessionStore();
  const job = useWalletJob(moduleId);
  const [isConfirming, setIsConfirming] =
    useLocationToggle("regenerate-confirm");
  const pendingRef = useRef<WalletRequest | null>(null);
  const { generate: runGenerate, derive: runDerive } = job;

  const run = useCallback(
    async (request: WalletRequest) => {
      if (request.kind === RequestKind.GENERATE) {
        const result = await runGenerate(request.count, request.options);
        if (result) reportJobResult(result, request.count, "Generated");
      } else {
        const result = await runDerive(request.job);
        if (result) reportJobResult(result, request.job.count, "Derived");
      }
    },
    [runGenerate, runDerive],
  );

  const request = useCallback(
    (walletRequest: WalletRequest) => {
      const { unsaved, rows } = store.getState();

      if (unsaved && rows.length > 0) {
        pendingRef.current = walletRequest;
        setIsConfirming(true);
      } else {
        run(walletRequest);
      }
    },
    [store, run, setIsConfirming],
  );

  const generate = useCallback(
    (count: number, options: WalletGeneratorOptions) =>
      request({ kind: RequestKind.GENERATE, count, options }),
    [request],
  );

  const derive = useCallback(
    (deriveJob: Omit<DeriveJob, "moduleId">) =>
      request({ kind: RequestKind.DERIVE, job: deriveJob }),
    [request],
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
    status: job.status,
    progress: job.progress,
    cancel: job.cancel,
    generate,
    derive,
    isConfirming,
    confirmReplace,
    cancelReplace,
  };
}
