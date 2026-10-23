import { MnemonicType } from "../derive";
import { LetterCase, BASE58_ALPHABET } from "../vanity";
import { defineWalletModule } from "../define";
import { presets } from "./presets";
import { SolanaWallet, fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "solana",
  title: "Solana Wallets",
  icon: Icon,
  fields,
  vanity: {
    field: SolanaWallet.ADDRESS,
    fixedPrefix: "",
    alphabet: BASE58_ALPHABET,
    letterCase: LetterCase.MIXED,
    base58Range: { bytes: 32 },
  },
  derive: {
    mnemonic: MnemonicType.BIP39,
    presets: presets,
    customPath: true,
  },
  order: 50,
  tags: ["SOL", "WIF", "PENGU"],
  defaultExpanded: true,
});
