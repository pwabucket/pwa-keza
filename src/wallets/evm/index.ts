import { MnemonicType } from "../derive";
import { defineWalletModule } from "../define";
import { presets } from "./presets";
import { EVMWallet, fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "evm",
  title: "EVM Wallets",
  icon: Icon,
  fields,
  derive: {
    mnemonic: MnemonicType.BIP39,
    presets: presets,
    customPath: true,
  },
  order: 40,
  tags: ["ETH", "BNB", "POL"],
  getParcelConfig(wallets) {
    return {
      group: "evm",
      recipients: wallets.map((w) => w[EVMWallet.ADDRESS]),
      senders: wallets.map((w) => ({
        address: w[EVMWallet.ADDRESS],
        privateKey: w[EVMWallet.PRIVATE_KEY],
      })),
    };
  },
});
