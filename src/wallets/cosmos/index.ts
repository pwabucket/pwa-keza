import { MnemonicType } from "../derive";
import { defineWalletModule } from "../define";
import { presets } from "./presets";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "cosmos",
  title: "Cosmos Wallets",
  icon: Icon,
  fields,
  derive: {
    mnemonic: MnemonicType.BIP39,
    presets: presets,
    customPath: true,
  },
  tags: ["ATOM", "OSMO"],
});
