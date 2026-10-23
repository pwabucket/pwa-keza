import {
  DERIVATION_PATH_FIELD,
  FieldKind,
  mnemonicPattern,
  type WalletField,
} from "../fields";

export const AptosWallet = {
  MNEMONIC: "Mnemonic Phrase",
  ADDRESS: "Address",
  PUBLIC_KEY: "Public Key",
  PRIVATE_KEY: "Private Key",
} as const;

export const fields: WalletField[] = [
  {
    label: AptosWallet.MNEMONIC,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(12),
  },
  {
    label: AptosWallet.ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: /^0x[0-9a-f]{64}$/,
  },
  {
    label: AptosWallet.PUBLIC_KEY,
    kind: FieldKind.PUBLIC_KEY,
    pattern: /^0x[0-9a-f]{64}$/,
  },
  {
    label: AptosWallet.PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: /^ed25519-priv-0x[0-9a-f]{64}$/,
  },
  DERIVATION_PATH_FIELD,
];
