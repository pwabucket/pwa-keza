import ConfirmDialog from "./ui/ConfirmDialog";
import DeriveForm from "./generator/DeriveForm";
import GeneratorModeSwitch from "./generator/GeneratorModeSwitch";
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
    isConfirming,
    confirmReplace,
    cancelReplace,
  } = useGenerateWallets(module.id);
  const isRunning = status === JobStatus.RUNNING;
  const isDeriving = module.derive && mode === GeneratorMode.DERIVE;

  return (
    <InnerAppLayout
      headerMiddleContent={
        <HeaderTitle icon={module.icon}>{module.title}</HeaderTitle>
      }
      className="gap-4"
    >
      {module.derive ? (
        <GeneratorModeSwitch mode={mode} onChange={setMode} />
      ) : null}

      {isDeriving ? (
        <DeriveForm module={module} onDerive={derive} isRunning={isRunning} />
      ) : (
        <WalletGeneratorInput
          onGenerate={generate}
          isGenerating={isRunning}
          supportsTestnet={module.supportsTestnet ?? false}
        />
      )}

      {isRunning ? (
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
          {isDeriving
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
