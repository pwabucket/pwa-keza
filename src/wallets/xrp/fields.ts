import {
  BASE58,
  DERIVATION_PATH_FIELD,
  FieldKind,
  type WalletField,
  mnemonicPattern,
} from "../fields";

export const XRPWallet = {
  MNEMONIC: "Mnemonic Phrase",
  ADDRESS: "Address",
  PUBLIC_KEY: "Public Key",
  PRIVATE_KEY: "Private Key",
} as const;

export const fields: WalletField[] = [
  {
    label: XRPWallet.MNEMONIC,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(12),
  },
  {
    label: XRPWallet.ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^r${BASE58}{24,34}$`),
  },
  {
    label: XRPWallet.PUBLIC_KEY,
    kind: FieldKind.PUBLIC_KEY,
    pattern: /^0[23][0-9A-F]{64}$/,
  },
  {
    label: XRPWallet.PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: /^00[0-9A-F]{64}$/,
  },
  DERIVATION_PATH_FIELD,
];
