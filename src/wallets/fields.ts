/** What a wallet field holds, which decides how it is shown and searched */
export const FieldKind = {
  ADDRESS: "address",
  PUBLIC_KEY: "public-key",
  SECRET: "secret",
  MNEMONIC: "mnemonic",
  /** Descriptive values such as a derivation path */
  META: "meta",
} as const;

export type FieldKind = (typeof FieldKind)[keyof typeof FieldKind];

/** Kinds that are hidden until revealed and cleared after copying */
export const SECRET_KINDS: ReadonlySet<FieldKind> = new Set([
  FieldKind.SECRET,
  FieldKind.MNEMONIC,
]);

export interface WalletField {
  /** Column label, also the CSV/JSON header; never rename an existing one */
  label: string;
  kind: FieldKind;
  /** Older backups may lack this column */
  optional?: boolean;
  /** Shape of a valid value, used to recognise a module's backups */
  pattern?: RegExp;
}

/** A space-separated phrase of exactly `words` lowercase words */
export function mnemonicPattern(words: number) {
  return new RegExp(`^[a-z]+( [a-z]+){${words - 1}}$`);
}

/** Base58 alphabet, as used by Bitcoin, Solana and Tron */
export const BASE58 = "[1-9A-HJ-NP-Za-km-z]";

/** Path a wallet was derived at; {purpose} stands for each address type */
export const DERIVATION_PATH_FIELD: WalletField = {
  label: "Derivation Path",
  kind: FieldKind.META,
  optional: true,
  pattern: /^m(\/(\d+|\{purpose\})'?)+$/,
};
