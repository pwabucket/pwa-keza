import { MnemonicType } from "../derive";
import { defineWalletModule } from "../define";
import { presets } from "./presets";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "tron",
  title: "Tron Wallets",
  icon: Icon,
  fields,
  derive: {
    mnemonic: MnemonicType.BIP39,
    presets: presets,
    customPath: true,
  },
  order: 70,
  tags: ["TRX", "SUN", "BTT"],
});
