import { BASE58, FieldKind, type WalletField } from "../fields";

export const SolanaWallet = {
  ADDRESS: "Address",
  SECRET_KEY: "Secret Key",
} as const;

export const fields: WalletField[] = [
  {
    label: SolanaWallet.ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^${BASE58}{32,44}$`),
  },
  {
    label: SolanaWallet.SECRET_KEY,
    kind: FieldKind.SECRET,
    pattern: /^[0-9a-f]{128}$/,
  },
];
