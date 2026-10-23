import {
  BASE58,
  DERIVATION_PATH_FIELD,
  FieldKind,
  type WalletField,
  mnemonicPattern,
} from "../fields";

export const TronWallet = {
  ADDRESS: "Address",
  PHRASE: "Phrase",
  PUBLIC_KEY: "Public Key",
  PRIVATE_KEY: "Private Key",
} as const;

export const fields: WalletField[] = [
  {
    label: TronWallet.ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^T${BASE58}{33}$`),
  },
  {
    label: TronWallet.PUBLIC_KEY,
    kind: FieldKind.PUBLIC_KEY,
    pattern: /^0x04[0-9a-f]{128}$/,
  },
  {
    label: TronWallet.PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: /^0x[0-9a-f]{64}$/,
  },
  {
    label: TronWallet.PHRASE,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(12),
  },
  DERIVATION_PATH_FIELD,
];
