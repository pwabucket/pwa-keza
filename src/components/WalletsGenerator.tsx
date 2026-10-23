import toast from "react-hot-toast";
import { useCallback } from "react";

import HeaderTitle from "../layouts/HeaderTitle";
import InnerAppLayout from "../layouts/InnerAppLayout";
import JobProgress from "./JobProgress";
import WalletGeneratorInput from "../components/WalletGeneratorInput";
import WalletList from "./WalletList";
import useWallets from "../hooks/useWallets";
import useGeneratorContext from "../hooks/useGeneratorContext";
import useWalletJob, { type JobResult } from "../hooks/useWalletJob";
import { JobStatus } from "../workers/protocol";
import { MIN_WALLET_COUNT, clampCount, parseCount } from "../lib/count";

const numberFormat = new Intl.NumberFormat();

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

export default function WalletsGenerator() {
  const wallet = useGeneratorContext();
  const { rows, status, progress, start, cancel } = useWalletJob(wallet.id);
  const { count, expanded, setExpanded, setCount, isTestnet, setIsTestnet } =
    useWallets(wallet.defaultExpanded ?? false);
  const isGenerating = status === JobStatus.RUNNING;

  /* Generate wallets */
  const generateWallets = useCallback(async () => {
    const parsedCount = parseCount(count);

    if (parsedCount === null || parsedCount < MIN_WALLET_COUNT) {
      toast.error("Enter how many wallets to generate.", { id: "count" });
      return;
    }

    const total = clampCount(parsedCount);

    setCount(total);

    const result = await start(total, { testnet: isTestnet });

    if (result) {
      reportJobResult(result, total);
    }
  }, [count, isTestnet, setCount, start]);

  return (
    <InnerAppLayout
      headerMiddleContent={
        <HeaderTitle icon={wallet.icon}>{wallet.title}</HeaderTitle>
      }
    >
      <WalletGeneratorInput
        count={count}
        setCount={setCount}
        generate={generateWallets}
        isGenerating={isGenerating}
        isTestnet={isTestnet}
        setIsTestnet={setIsTestnet}
        supportsTestnet={wallet.supportsTestnet || false}
      />

      {isGenerating ? (
        <JobProgress
          done={rows.length}
          total={progress.total}
          startedAt={progress.startedAt}
          onStop={cancel}
          className="mt-4"
        />
      ) : null}

      {rows.length > 0 ? (
        <WalletList
          id={wallet.id}
          wallets={rows}
          expanded={expanded}
          setExpanded={setExpanded}
          getParcelConfig={wallet.getParcelConfig}
        />
      ) : isGenerating ? null : (
        <p className="italic text-center p-4">Click Generate to start...</p>
      )}
    </InnerAppLayout>
  );
}
