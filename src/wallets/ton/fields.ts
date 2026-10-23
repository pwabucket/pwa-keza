import { FieldKind, type WalletField, mnemonicPattern } from "../fields";

export const TONWallet = {
  ADDRESS_V5: "Address V5",
  ADDRESS_V4: "Address V4",
  PUBLIC_KEY: "Public Key",
  SECRET_KEY: "Secret Key",
  PHRASE: "Phrase",
} as const;

/** User-friendly address: mainnet (UQ/EQ) or testnet (0Q/kQ) */
const ADDRESS_PATTERN = /^[UE0k]Q[A-Za-z0-9_-]{46}$/;

export const fields: WalletField[] = [
  {
    label: TONWallet.ADDRESS_V5,
    kind: FieldKind.ADDRESS,
    pattern: ADDRESS_PATTERN,
  },
  {
    label: TONWallet.ADDRESS_V4,
    kind: FieldKind.ADDRESS,
    pattern: ADDRESS_PATTERN,
  },
  {
    label: TONWallet.PUBLIC_KEY,
    kind: FieldKind.PUBLIC_KEY,
    pattern: /^[0-9a-f]{64}$/,
  },
  {
    label: TONWallet.SECRET_KEY,
    kind: FieldKind.SECRET,
    pattern: /^[0-9a-f]{128}$/,
  },
  {
    label: TONWallet.PHRASE,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(24),
  },
];
