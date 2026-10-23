import { FieldKind, type WalletField, mnemonicPattern } from "../fields";
import { MnemonicWallet } from "../mnemonic";

export const fields: WalletField[] = [
  {
    label: MnemonicWallet.PHRASE,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(24),
  },
];
