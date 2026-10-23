import toast from "react-hot-toast";
import { useCallback, useRef } from "react";
import { useLocationToggle } from "@pwabucket/pwa-router";

import useSessionStore from "./useSessionStore";
import useVanitySearch, { type VanityResult } from "./useVanitySearch";
import useWalletJob, { type JobResult } from "./useWalletJob";
import { type DeriveJob, JobStatus } from "../workers/protocol";
import type { VanityMatcher } from "../lib/vanity";
import type { WalletGeneratorOptions } from "../types/wallet";

const numberFormat = new Intl.NumberFormat();

const RequestKind = {
  GENERATE: "generate",
  DERIVE: "derive",
  VANITY: "vanity",
} as const;

type WalletRequest =
  | {
      kind: typeof RequestKind.GENERATE;
      count: number;
      options: WalletGeneratorOptions;
    }
  | { kind: typeof RequestKind.DERIVE; job: Omit<DeriveJob, "moduleId"> }
  | { kind: typeof RequestKind.VANITY; matcher: VanityMatcher };

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

/** Tells the user how a vanity search went */
function reportVanityResult({ status, attempts, row, error }: VanityResult) {
  switch (status) {
    case JobStatus.DONE:
      toast.success(
        `Found ${row?.Address ?? "a match"} after ${numberFormat.format(attempts)} tries.`,
        { id: "job" },
      );
      break;
    case JobStatus.CANCELLED:
      toast(`Stopped after ${numberFormat.format(attempts)} tries.`, {
        id: "job",
      });
      break;
    case JobStatus.FAILED:
      toast.error(error instanceof Error ? error.message : String(error), {
        id: "job",
      });
      break;
  }
}

/**
 * Generates, derives or searches for wallets, asking first when unsaved
 * wallets would be replaced.
 */
export default function useGenerateWallets(moduleId: string) {
  const store = useSessionStore();
  const job = useWalletJob(moduleId);
  const vanity = useVanitySearch(moduleId);
  const [isConfirming, setIsConfirming] =
    useLocationToggle("regenerate-confirm");
  const pendingRef = useRef<WalletRequest | null>(null);
  const { generate: runGenerate, derive: runDerive } = job;
  const { search: runVanity, ownsRows } = vanity;

  const run = useCallback(
    async (request: WalletRequest) => {
      if (request.kind === RequestKind.GENERATE) {
        const result = await runGenerate(request.count, request.options);
        if (result) reportJobResult(result, request.count, "Generated");
      } else if (request.kind === RequestKind.DERIVE) {
        const result = await runDerive(request.job);
        if (result) reportJobResult(result, request.job.count, "Derived");
      } else {
        const result = await runVanity(request.matcher);
        if (result) reportVanityResult(result);
      }
    },
    [runGenerate, runDerive, runVanity],
  );

  const request = useCallback(
    (walletRequest: WalletRequest) => {
      const { unsaved, rows } = store.getState();

      /* New vanity matches are added to earlier ones, not replacing them */
      const adds = walletRequest.kind === RequestKind.VANITY && ownsRows();

      if (unsaved && rows.length > 0 && !adds) {
        pendingRef.current = walletRequest;
        setIsConfirming(true);
      } else {
        run(walletRequest);
      }
    },
    [store, run, ownsRows, setIsConfirming],
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

  const searchVanity = useCallback(
    (matcher: VanityMatcher) => request({ kind: RequestKind.VANITY, matcher }),
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
    vanityStatus: vanity.status,
    vanityStats: vanity.stats,
    stopVanity: vanity.stop,
    generate,
    derive,
    searchVanity,
    isConfirming,
    confirmReplace,
    cancelReplace,
  };
}
