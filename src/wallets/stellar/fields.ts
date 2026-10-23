import { FieldKind, type WalletField } from "../fields";

export const StellarWallet = {
  ADDRESS: "Address",
  SECRET_KEY: "Secret Key",
} as const;

export const fields: WalletField[] = [
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
