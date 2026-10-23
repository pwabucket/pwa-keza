import type { WalletField } from "../wallets/fields";
import type { MnemonicType } from "../wallets/derive";
import type { LetterCase } from "../wallets/vanity";

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

/** A random wallet whose full row is only built when its address matches */
export interface VanityCandidate {
  address: string;
  toRow: () => Promise<WalletRow>;
}

/** Makes one vanity candidate; vanity modules' generator.ts export one */
export type VanityGenerator = () => Promise<VanityCandidate>;

export interface VanityCapability {
  /** Label of the address field that is matched */
  field: string;
  /** Characters every address starts with, e.g. 0x or T */
  fixedPrefix: string;
  /** Characters that can follow the fixed prefix anywhere in the address */
  alphabet: string;
  /** Characters that can come first after the fixed prefix, when limited */
  firstCharacters?: string;
  letterCase: LetterCase;
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
  /** Present when addresses can be searched for a prefix or suffix */
  vanity?: VanityCapability;
  getParcelConfig?: GetParcelConfig;
}

export interface WalletModule extends WalletModuleDefinition {
  fieldsByLabel: ReadonlyMap<string, WalletField>;
  /** Labels every backup of this module has */
  requiredLabels: readonly string[];
}
