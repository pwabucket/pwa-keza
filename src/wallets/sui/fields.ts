import {
  DERIVATION_PATH_FIELD,
  FieldKind,
  mnemonicPattern,
  type WalletField,
} from "../fields";

export const SuiWallet = {
  MNEMONIC: "Mnemonic Phrase",
  ADDRESS: "Address",
  PRIVATE_KEY: "Private Key",
} as const;

export const fields: WalletField[] = [
  {
    label: SuiWallet.MNEMONIC,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(12),
  },
  {
    label: SuiWallet.ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: /^0x[0-9a-f]{64}$/,
  },
  {
    label: SuiWallet.PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: /^suiprivkey1[02-9ac-hj-np-z]{59}$/,
  },
  DERIVATION_PATH_FIELD,
];
