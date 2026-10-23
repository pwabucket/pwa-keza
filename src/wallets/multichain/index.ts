import { MnemonicType } from "../derive";
import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";
import { presets } from "./presets";

export default defineWalletModule({
  id: "multichain",
  title: "Multi-Chain Wallets",
  icon: Icon,
  fields,
  order: 25,
  derive: {
    mnemonic: MnemonicType.BIP39,
    presets,
    customPath: false,
  },
  tags: ["EVM", "TRX", "BTC", "SOL", "XLM"],
});
