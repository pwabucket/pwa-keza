import ConfirmDialog from "./ui/ConfirmDialog";
import DeriveForm from "./generator/DeriveForm";
import GeneratorModeSwitch from "./generator/GeneratorModeSwitch";
import VanityForm from "./generator/VanityForm";
import HeaderTitle from "../layouts/HeaderTitle";
import InnerAppLayout from "../layouts/InnerAppLayout";
import JobProgress from "./JobProgress";
import UnsavedGuard from "./wallet/UnsavedGuard";
import WalletGeneratorInput from "./WalletGeneratorInput";
import WalletList from "./wallet/WalletList";
import useGenerateWallets from "../hooks/useGenerateWallets";
import useGeneratorMode from "../hooks/useGeneratorMode";
import useSession from "../hooks/useSession";
import { GeneratorMode } from "./generator/generatorMode";
import { JobStatus } from "../workers/protocol";
import type { WalletModule } from "../types/wallet";

export default function WalletsGenerator({ module }: { module: WalletModule }) {
  const rowCount = useSession((state) => state.rows.length);
  const [mode, setMode] = useGeneratorMode();
  const {
    status,
    progress,
    generate,
    derive,
    cancel,
    vanityStatus,
    vanityStats,
    stopVanity,
    searchVanity,
    isConfirming,
    confirmReplace,
    cancelReplace,
  } = useGenerateWallets(module.id);
  const isJobRunning = status === JobStatus.RUNNING;
  const isSearching = vanityStatus === JobStatus.RUNNING;
  const isRunning = isJobRunning || isSearching;
  const isDeriving = module.derive && mode === GeneratorMode.DERIVE;
  const isVanity = module.vanity && mode === GeneratorMode.VANITY;
  const hasModes = Boolean(module.derive || module.vanity);

  return (
    <InnerAppLayout
      headerMiddleContent={
        <HeaderTitle icon={module.icon}>{module.title}</HeaderTitle>
      }
      className="gap-4"
    >
      {hasModes ? (
        <GeneratorModeSwitch module={module} mode={mode} onChange={setMode} />
      ) : null}

      {isVanity ? (
        <VanityForm
          capability={module.vanity!}
          onSearch={searchVanity}
          onStop={stopVanity}
          isSearching={isSearching}
          isRunning={isRunning}
          stats={vanityStats}
        />
      ) : isDeriving ? (
        <DeriveForm module={module} onDerive={derive} isRunning={isRunning} />
      ) : (
        <WalletGeneratorInput
          onGenerate={generate}
          isGenerating={isRunning}
          supportsTestnet={module.supportsTestnet ?? false}
        />
      )}

      {isJobRunning ? (
        <JobProgress
          done={rowCount}
          total={progress.total}
          startedAt={progress.startedAt}
          onStop={cancel}
        />
      ) : null}

      {rowCount > 0 ? (
        <div className="flex flex-col">
          <WalletList />
        </div>
      ) : isRunning ? null : (
        <p className="italic text-center p-4">
          {isVanity
            ? "Matches will appear here..."
            : isDeriving
              ? "Enter your phrase to derive its wallets..."
              : "Click Generate to start..."}
        </p>
      )}

      <ConfirmDialog
        open={isConfirming}
        title="Replace your wallets?"
        description="The wallets on this page haven't been downloaded. Continuing will replace them."
        confirmLabel="Replace"
        onConfirm={confirmReplace}
        onCancel={cancelReplace}
      />
      <UnsavedGuard />
    </InnerAppLayout>
  );
}
