import { FieldKind, type WalletField, mnemonicPattern } from "../fields";

export const EVMWallet = {
  ADDRESS: "Address",
  PUBLIC_KEY: "Public Key",
  PRIVATE_KEY: "Private Key",
  PHRASE: "Phrase",
} as const;

export const fields: WalletField[] = [
  {
    label: EVMWallet.ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: /^0x[0-9a-fA-F]{40}$/,
  },
  {
    label: EVMWallet.PUBLIC_KEY,
    kind: FieldKind.PUBLIC_KEY,
    pattern: /^0x0[23][0-9a-f]{64}$/,
  },
  {
    label: EVMWallet.PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: /^0x[0-9a-f]{64}$/,
  },
  {
    label: EVMWallet.PHRASE,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(12),
  },
];
