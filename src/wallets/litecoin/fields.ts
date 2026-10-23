import {
  BASE58,
  DERIVATION_PATH_FIELD,
  FieldKind,
  type WalletField,
  mnemonicPattern,
} from "../fields";

export const LitecoinWallet = {
  MNEMONIC: "Mnemonic Phrase",
  NATIVE_ADDRESS: "Native SegWit Address (P2WPKH)",
  NESTED_ADDRESS: "Nested SegWit Address (P2SH-P2WPKH)",
  LEGACY_ADDRESS: "Legacy Address (P2PKH)",
  PUBLIC_KEY: "Native SegWit Public Key",
  PRIVATE_KEY: "Native SegWit Private Key (WIF)",
} as const;

export const fields: WalletField[] = [
  {
    label: LitecoinWallet.MNEMONIC,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(12),
  },
  {
    label: LitecoinWallet.NATIVE_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: /^ltc1q[02-9ac-hj-np-z]{38}$/,
  },
  {
    label: LitecoinWallet.NESTED_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^M${BASE58}{25,34}$`),
  },
  {
    label: LitecoinWallet.LEGACY_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^L${BASE58}{25,34}$`),
  },
  {
    label: LitecoinWallet.PUBLIC_KEY,
    kind: FieldKind.PUBLIC_KEY,
    pattern: /^0[23][0-9a-f]{64}$/,
  },
  {
    label: LitecoinWallet.PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: new RegExp(`^T${BASE58}{51}$`),
  },
  DERIVATION_PATH_FIELD,
];
