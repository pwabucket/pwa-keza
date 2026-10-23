import { FieldKind, type WalletField, mnemonicPattern } from "../fields";

export const StellarWallet = {
  MNEMONIC: "Mnemonic Phrase",
  ADDRESS: "Address",
  SECRET_KEY: "Secret Key",
} as const;

export const fields: WalletField[] = [
  {
    label: StellarWallet.MNEMONIC,
    kind: FieldKind.MNEMONIC,
    optional: true,
    pattern: mnemonicPattern(12),
  },
  {
    label: StellarWallet.ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: /^G[A-Z2-7]{55}$/,
  },
  {
    label: StellarWallet.SECRET_KEY,
    kind: FieldKind.SECRET,
    pattern: /^S[A-Z2-7]{55}$/,
  },
];
