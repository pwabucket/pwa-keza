import { MnemonicType } from "../derive";
import { LetterCase, HEX_ALPHABET } from "../vanity";
import { defineWalletModule } from "../define";
import { presets } from "./presets";
import { SuiWallet, fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "sui",
  title: "Sui Wallets",
  icon: Icon,
  fields,
  vanity: {
    field: SuiWallet.ADDRESS,
    fixedPrefix: "0x",
    alphabet: HEX_ALPHABET,
    letterCase: LetterCase.LOWER,
  },
  derive: {
    mnemonic: MnemonicType.BIP39,
    presets: presets,
    customPath: true,
  },
  tags: ["SUI"],
});
