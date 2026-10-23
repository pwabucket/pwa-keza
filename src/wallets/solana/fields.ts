import {
  BASE58,
  FieldKind,
  type WalletField,
  mnemonicPattern,
} from "../fields";

export const SolanaWallet = {
  MNEMONIC: "Mnemonic Phrase",
  ADDRESS: "Address",
  PRIVATE_KEY: "Private Key (Base58)",
  SECRET_KEY: "Secret Key",
} as const;

export const fields: WalletField[] = [
  {
    label: SolanaWallet.MNEMONIC,
    kind: FieldKind.MNEMONIC,
    optional: true,
    pattern: mnemonicPattern(12),
  },
  {
    label: SolanaWallet.ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^${BASE58}{32,44}$`),
  },
  {
    label: SolanaWallet.PRIVATE_KEY,
    kind: FieldKind.SECRET,
    optional: true,
    pattern: new RegExp(`^${BASE58}{86,88}$`),
  },
  {
    label: SolanaWallet.SECRET_KEY,
    kind: FieldKind.SECRET,
    pattern: /^[0-9a-f]{128}$/,
  },
];
