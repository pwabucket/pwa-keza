import {
  BASE58,
  DERIVATION_PATH_FIELD,
  FieldKind,
  type WalletField,
  mnemonicPattern,
} from "../fields";

export const BitcoinWallet = {
  MNEMONIC: "Mnemonic Phrase",
  TAPROOT_ADDRESS: "Taproot Address (P2TR)",
  NESTED_ADDRESS: "Nested SegWit Address (P2SH-P2WPKH)",
  NATIVE_ADDRESS: "Native SegWit Address (P2WPKH)",
  LEGACY_ADDRESS: "Legacy Address (P2PKH)",
  PUBLIC_KEY: "Public Key",
  PRIVATE_KEY: "Private Key (WIF)",
} as const;

/** Bech32 data characters */
const BECH32 = "[02-9ac-hj-np-z]";

/* Patterns accept both mainnet and testnet values */

export const fields: WalletField[] = [
  {
    label: BitcoinWallet.MNEMONIC,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(12),
  },
  {
    label: BitcoinWallet.TAPROOT_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^(bc|tb)1p${BECH32}{58}$`),
  },
  {
    label: BitcoinWallet.NESTED_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^[23]${BASE58}{25,34}$`),
  },
  {
    label: BitcoinWallet.NATIVE_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^(bc|tb)1q${BECH32}{38}$`),
  },
  {
    label: BitcoinWallet.LEGACY_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^[1mn]${BASE58}{25,34}$`),
  },
  {
    label: BitcoinWallet.PUBLIC_KEY,
    kind: FieldKind.PUBLIC_KEY,
    note: "Of the Taproot (P2TR) address",
    pattern: /^0[23][0-9a-f]{64}$/,
  },
  {
    label: BitcoinWallet.PRIVATE_KEY,
    kind: FieldKind.SECRET,
    note: "Of the Taproot (P2TR) address",
    pattern: new RegExp(`^[KLc]${BASE58}{51}$`),
  },
  DERIVATION_PATH_FIELD,
];
