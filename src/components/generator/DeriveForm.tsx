import { memo, useCallback } from "react";

import Input from "../Input";
import LabelToggle from "../LabelToggle";
import MnemonicInput from "./MnemonicInput";
import NumberStepper from "../ui/NumberStepper";
import useDeriveForm, { MAX_DERIVE_COUNT } from "../../hooks/useDeriveForm";
import useHotkeys from "../../hooks/useHotkeys";
import { CUSTOM_PRESET_ID } from "../../wallets/derive";
import { cn } from "../../lib/utils";
import type { DeriveJob } from "../../workers/protocol";
import type { WalletModule } from "../../types/wallet";

const FIELD_CLASS = cn(
  "bg-neutral-700 px-4 py-2 rounded-lg min-w-0",
  "focus:outline-hidden focus:ring-3 focus:ring-yellow-300",
);

type DeriveFormProps = {
  module: WalletModule;
  onDerive: (job: Omit<DeriveJob, "moduleId">) => void;
  isRunning: boolean;
};

/** Derives accounts from a phrase the user already has */
export default memo(function DeriveForm({
  module,
  onDerive,
  isRunning,
}: DeriveFormProps) {
  const form = useDeriveForm(module);
  const { buildJob } = form;

  const submit = useCallback(() => {
    if (isRunning) return;

    const job = buildJob();
    if (job) onDerive(job);
  }, [isRunning, buildJob, onDerive]);

  useHotkeys({ g: submit });

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <MnemonicInput
        value={form.mnemonic}
        onChange={form.setMnemonic}
        wordCount={form.wordCount}
        disabled={isRunning}
      />

      {form.isTon ? null : (
        <>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-neutral-300">
              Passphrase (optional)
            </span>
            <Input
              type="password"
              value={form.passphrase}
              onChange={form.handlePassphraseChange}
              autoComplete="off"
              placeholder="Leave empty unless your wallet uses one"
              disabled={isRunning}
            />
            <span className="text-xs text-neutral-400">
              The passphrase isn't saved in backups.
            </span>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-neutral-300">
              Wallet app
            </span>
            <select
              value={form.presetId}
              onChange={form.handlePresetChange}
              disabled={isRunning}
              className={FIELD_CLASS}
            >
              {form.capability.presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.title}
                </option>
              ))}
              {form.capability.customPath ? (
                <option value={CUSTOM_PRESET_ID}>Custom path</option>
              ) : null}
            </select>
          </label>

          {form.presetId === CUSTOM_PRESET_ID ? (
            <Input
              aria-label="Derivation path"
              placeholder="m/44'/60'/0'/0/{i}"
              value={form.customPath}
              onChange={form.handleCustomPathChange}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              disabled={isRunning}
            />
          ) : null}

          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col gap-1 grow basis-40 min-w-0">
              <span className="text-xs font-bold text-neutral-300">
                First account
              </span>
              <NumberStepper
                label="First account"
                value={form.start}
                min={0}
                max={2 ** 31 - 1}
                onChange={form.setStart}
                onStep={form.stepStart}
              />
            </div>
            <div className="flex flex-col gap-1 grow basis-40 min-w-0">
              <span className="text-xs font-bold text-neutral-300">
                Accounts
              </span>
              <NumberStepper
                label="Accounts"
                value={form.count}
                min={1}
                max={MAX_DERIVE_COUNT}
                onChange={form.setCount}
                onStep={form.stepCount}
              />
            </div>
          </div>
        </>
      )}

      {module.supportsTestnet ? (
        <div className="flex items-center justify-center">
          <LabelToggle checked={form.testnet} onChange={form.toggleTestnet}>
            Testnet
          </LabelToggle>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isRunning}
        aria-keyshortcuts="G"
        className={cn(
          "px-4 py-2 rounded-xl bg-yellow-500 text-black",
          "disabled:opacity-60",
          "focus-visible:outline-hidden focus-visible:ring-3",
          "focus-visible:ring-yellow-300",
        )}
      >
        Derive wallets
      </button>

      <p className="text-xs text-yellow-400 text-center">
        Check that Wallet 1's address matches the first account in your wallet
        app before using these keys.
      </p>
    </form>
  );
});
