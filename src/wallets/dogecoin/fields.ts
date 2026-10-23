import {
  BASE58,
  FieldKind,
  type WalletField,
  mnemonicPattern,
} from "../fields";

export const DogecoinWallet = {
  MNEMONIC: "Mnemonic Phrase",
  ADDRESS: "Address",
  PUBLIC_KEY: "Public Key",
  PRIVATE_KEY: "Private Key (WIF)",
} as const;

export const fields: WalletField[] = [
  {
    label: DogecoinWallet.MNEMONIC,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(12),
  },
  {
    label: DogecoinWallet.ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^D${BASE58}{25,34}$`),
  },
  {
    label: DogecoinWallet.PUBLIC_KEY,
    kind: FieldKind.PUBLIC_KEY,
    pattern: /^0[23][0-9a-f]{64}$/,
  },
  {
    label: DogecoinWallet.PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: new RegExp(`^Q${BASE58}{51}$`),
  },
];
