import {
  BASE58,
  DERIVATION_PATH_FIELD,
  FieldKind,
  type WalletField,
  mnemonicPattern,
} from "../fields";

export const NEARWallet = {
  MNEMONIC: "Mnemonic Phrase",
  ACCOUNT_ID: "Implicit Account ID",
  PUBLIC_KEY: "Public Key",
  SECRET_KEY: "Secret Key",
} as const;

export const fields: WalletField[] = [
  {
    label: NEARWallet.MNEMONIC,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(12),
  },
  {
    label: NEARWallet.ACCOUNT_ID,
    kind: FieldKind.ADDRESS,
    pattern: /^[0-9a-f]{64}$/,
  },
  {
    label: NEARWallet.PUBLIC_KEY,
    kind: FieldKind.PUBLIC_KEY,
    pattern: new RegExp(`^ed25519:${BASE58}{43,44}$`),
  },
  {
    label: NEARWallet.SECRET_KEY,
    kind: FieldKind.SECRET,
    pattern: new RegExp(`^ed25519:${BASE58}{86,88}$`),
  },
  DERIVATION_PATH_FIELD,
];
