import { MnemonicType } from "../derive";
import { LetterCase, BASE58_ALPHABET } from "../vanity";
import { defineWalletModule } from "../define";
import { presets } from "./presets";
import { TronWallet, fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "tron",
  title: "Tron Wallets",
  icon: Icon,
  fields,
  vanity: {
    field: TronWallet.ADDRESS,
    fixedPrefix: "T",
    alphabet: BASE58_ALPHABET,
    firstCharacters: "9ABCDEFGHJKLMNPQRSTUVWXYZ",
    letterCase: LetterCase.MIXED,
  },
  derive: {
    mnemonic: MnemonicType.BIP39,
    presets: presets,
    customPath: true,
  },
  order: 70,
  tags: ["TRX", "SUN", "BTT"],
});
