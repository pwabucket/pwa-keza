import type { WalletField } from "../wallets/fields";
import type { MnemonicType } from "../wallets/derive";

/** One wallet: field label to value, in display order */
export type WalletRow = Record<string, string>;

export interface WalletGeneratorOptions {
  testnet?: boolean;
}

/** Generates one wallet; each module's generator.ts default-exports one */
export type WalletGenerator = (
  options: WalletGeneratorOptions,
) => Promise<WalletRow>;

/** One account to derive from an existing phrase */
export interface DeriveRequest {
  mnemonic: string;
  /** BIP39 seed of the phrase and passphrase; empty for TON phrases */
  seed: Uint8Array;
  /** Account index, substituted for {i} in the path template */
  index: number;
  pathTemplate: string;
  testnet?: boolean;
}

/** Derives one wallet; each derivable module's generator.ts exports one */
export type WalletDeriver = (request: DeriveRequest) => Promise<WalletRow>;

/** A wallet app's derivation path, with {i} where the account index goes */
export interface DerivePreset {
  id: string;
  title: string;
  path: string;
}

export interface DeriveCapability {
  mnemonic: MnemonicType;
  /** The first preset is the one used when generating */
  presets: DerivePreset[];
  /** Whether a custom path template can be entered */
  customPath: boolean;
}

export type WalletResult<T extends Record<string, string>> = Record<
  T[keyof T],
  string
>;

export interface GetParcelConfig {
  (wallets: WalletRow[], options?: Record<string, unknown>): any;
}

export interface WalletModuleDefinition {
  id: string;
  title: string;
  icon: string;
  tags: string[];
  /** Every column the module produces */
  fields: WalletField[];
  /** Position on Home; modules without one follow, sorted by title */
  order?: number;
  defaultExpanded?: boolean;
  supportsTestnet?: boolean;
  /** Present when wallets can be derived from an existing phrase */
  derive?: DeriveCapability;
  getParcelConfig?: GetParcelConfig;
}

export interface WalletModule extends WalletModuleDefinition {
  fieldsByLabel: ReadonlyMap<string, WalletField>;
  /** Labels every backup of this module has */
  requiredLabels: readonly string[];
}
