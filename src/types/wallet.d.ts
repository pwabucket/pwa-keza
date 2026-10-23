import type { WalletField } from "../wallets/fields";

/** One wallet: field label to value, in display order */
export type WalletRow = Record<string, string>;

export interface WalletGeneratorOptions {
  testnet?: boolean;
}

/** Generates one wallet; each module's generator.ts default-exports one */
export type WalletGenerator = (
  options: WalletGeneratorOptions,
) => Promise<WalletRow>;

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
  defaultExpanded?: boolean;
  supportsTestnet?: boolean;
  getParcelConfig?: GetParcelConfig;
}

export interface WalletModule extends WalletModuleDefinition {
  fieldsByLabel: ReadonlyMap<string, WalletField>;
  /** Labels every backup of this module has */
  requiredLabels: readonly string[];
}
