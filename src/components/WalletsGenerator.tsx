import ConfirmDialog from "./ui/ConfirmDialog";
import HeaderTitle from "../layouts/HeaderTitle";
import InnerAppLayout from "../layouts/InnerAppLayout";
import JobProgress from "./JobProgress";
import UnsavedGuard from "./wallet/UnsavedGuard";
import WalletGeneratorInput from "./WalletGeneratorInput";
import WalletList from "./wallet/WalletList";
import useGenerateWallets from "../hooks/useGenerateWallets";
import useSession from "../hooks/useSession";
import { JobStatus } from "../workers/protocol";
import type { WalletModule } from "../types/wallet";

export default function WalletsGenerator({ module }: { module: WalletModule }) {
  const rowCount = useSession((state) => state.rows.length);
  const {
    status,
    progress,
    generate,
    cancel,
    isConfirming,
    confirmReplace,
    cancelReplace,
  } = useGenerateWallets(module.id);
  const isGenerating = status === JobStatus.RUNNING;

  return (
    <InnerAppLayout
      headerMiddleContent={
        <HeaderTitle icon={module.icon}>{module.title}</HeaderTitle>
      }
    >
      <WalletGeneratorInput
        onGenerate={generate}
        isGenerating={isGenerating}
        supportsTestnet={module.supportsTestnet ?? false}
      />

      {isGenerating ? (
        <JobProgress
          done={rowCount}
          total={progress.total}
          startedAt={progress.startedAt}
          onStop={cancel}
          className="mt-4"
        />
      ) : null}

      {rowCount > 0 ? (
        <WalletList />
      ) : isGenerating ? null : (
        <p className="italic text-center p-4">Click Generate to start...</p>
      )}

      <ConfirmDialog
        open={isConfirming}
        title="Replace your wallets?"
        description="The wallets on this page haven't been downloaded. Generating again will replace them."
        confirmLabel="Replace"
        onConfirm={confirmReplace}
        onCancel={cancelReplace}
      />
      <UnsavedGuard />
    </InnerAppLayout>
  );
}
