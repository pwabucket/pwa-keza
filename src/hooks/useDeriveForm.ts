import toast from "react-hot-toast";
import { useCallback, useMemo, useState } from "react";

import {
  CUSTOM_PRESET_ID,
  MAX_INDEX,
  MnemonicType,
  isValidPath,
  normalizeMnemonic,
  resolvePath,
} from "../wallets/derive";
import { parseCount } from "../lib/count";
import type { DeriveJob } from "../workers/protocol";
import type { WalletModule } from "../types/wallet";

/** Most accounts derived in one go */
export const MAX_DERIVE_COUNT = 1000;

/** Sample values for checking a custom path's placeholders */
const SAMPLE_PATH_VALUES = { purpose: 44, coin: 0, i: 0 };

/** Word counts a valid phrase can have */
const BIP39_WORD_COUNTS: ReadonlySet<number> = new Set([12, 15, 18, 21, 24]);
const TON_WORD_COUNTS: ReadonlySet<number> = new Set([24]);

/** Why the form can't be submitted yet, or null when it can */
function getFormError({
  wordCount,
  isTon,
  customPath,
  start,
  count,
}: {
  wordCount: number;
  isTon: boolean;
  /** The path the user typed, or null when a preset is chosen */
  customPath: string | null;
  start: number | null;
  count: number | null;
}) {
  const wordCounts = isTon ? TON_WORD_COUNTS : BIP39_WORD_COUNTS;

  if (!wordCounts.has(wordCount)) {
    return isTon
      ? "Enter your 24-word TON recovery phrase."
      : "Enter your 12 to 24-word recovery phrase.";
  }

  if (isTon) return null;

  if (
    customPath !== null &&
    !isValidPath(resolvePath(customPath, SAMPLE_PATH_VALUES))
  ) {
    return "Enter a derivation path such as m/44'/60'/0'/0/{i}.";
  }

  if (start === null || start < 0) {
    return "Enter the first account index.";
  }

  if (count === null || count < 1 || count > MAX_DERIVE_COUNT) {
    return `Derive between 1 and ${MAX_DERIVE_COUNT} accounts.`;
  }

  if (start + count - 1 > MAX_INDEX) {
    return `Account indexes can't go past ${MAX_INDEX}.`;
  }

  /* Without {i} every account would be the same one */
  if (customPath !== null && count > 1 && !customPath.includes("{i}")) {
    return "Add {i} to the path where the account number goes, or derive 1 account.";
  }

  return null;
}

/** State and validation of the "from phrase" form for one module */
export default function useDeriveForm(module: WalletModule) {
  const capability = module.derive!;
  const isTon = capability.mnemonic === MnemonicType.TON;

  const [mnemonic, setMnemonic] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [presetId, setPresetId] = useState(
    capability.presets[0]?.id ?? CUSTOM_PRESET_ID,
  );
  const [customPath, setCustomPath] = useState("");
  const [start, setStart] = useState<string | number>(0);
  const [count, setCount] = useState<string | number>(1);
  const [testnet, setTestnet] = useState(false);

  const stepStart = useCallback(
    (step: number) =>
      setStart((prev) => Math.max((parseCount(prev) ?? 0) + step, 0)),
    [],
  );
  const stepCount = useCallback(
    (step: number) =>
      setCount((prev) =>
        Math.min(Math.max((parseCount(prev) ?? 1) + step, 1), MAX_DERIVE_COUNT),
      ),
    [],
  );
  const handlePassphraseChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setPassphrase(event.target.value),
    [],
  );
  const handleCustomPathChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setCustomPath(event.target.value),
    [],
  );
  const handlePresetChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) =>
      setPresetId(event.target.value),
    [],
  );
  const toggleTestnet = useCallback(() => setTestnet((prev) => !prev), []);

  const normalized = useMemo(() => normalizeMnemonic(mnemonic), [mnemonic]);
  const wordCount = normalized ? normalized.split(" ").length : 0;

  const pathTemplate =
    presetId === CUSTOM_PRESET_ID
      ? customPath.trim()
      : (capability.presets.find((preset) => preset.id === presetId)?.path ??
        "");

  /** The job to run, or null after showing why the form isn't ready */
  const buildJob = useCallback((): Omit<DeriveJob, "moduleId"> | null => {
    const parsedStart = parseCount(start);
    const parsedCount = isTon ? 1 : parseCount(count);
    const error = getFormError({
      wordCount,
      isTon,
      customPath: presetId === CUSTOM_PRESET_ID ? pathTemplate : null,
      start: isTon ? 0 : parsedStart,
      count: parsedCount,
    });

    if (error) {
      toast.error(error, { id: "derive" });
      return null;
    }

    return {
      mnemonic: normalized,
      passphrase: isTon ? "" : passphrase,
      mnemonicType: capability.mnemonic,
      pathTemplate,
      start: isTon ? 0 : parsedStart!,
      count: parsedCount!,
      testnet,
    };
  }, [
    start,
    count,
    isTon,
    wordCount,
    presetId,
    pathTemplate,
    normalized,
    passphrase,
    capability.mnemonic,
    testnet,
  ]);

  return {
    isTon,
    capability,
    wordCount,
    mnemonic,
    setMnemonic,
    passphrase,
    handlePassphraseChange,
    presetId,
    handlePresetChange,
    customPath,
    handleCustomPathChange,
    start,
    setStart,
    stepStart,
    count,
    setCount,
    stepCount,
    testnet,
    toggleTestnet,
    buildJob,
  };
}
