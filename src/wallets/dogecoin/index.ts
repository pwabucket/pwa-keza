import { MnemonicType } from "../derive";
import { defineWalletModule } from "../define";
import { UTXO_PRESETS } from "../utxo/presets";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "dogecoin",
  title: "Dogecoin Wallets",
  icon: Icon,
  fields,
  derive: {
    mnemonic: MnemonicType.BIP39,
    presets: UTXO_PRESETS,
    customPath: true,
  },
  tags: ["DOGE"],
});
