import { MnemonicType } from "../derive";
import { LetterCase, BASE32_ALPHABET } from "../vanity";
import { defineWalletModule } from "../define";
import { presets } from "./presets";
import { StellarWallet, fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "stellar",
  title: "Stellar Wallets",
  icon: Icon,
  fields,
  vanity: {
    field: StellarWallet.ADDRESS,
    fixedPrefix: "G",
    alphabet: BASE32_ALPHABET,
    firstCharacters: "ABCD",
    letterCase: LetterCase.UPPER,
  },
  derive: {
    mnemonic: MnemonicType.BIP39,
    presets: presets,
    customPath: true,
  },
  tags: ["XLM", "SSLX", "USDC"],
  defaultExpanded: true,
});
