import { defineWalletModule } from "../define";
import { EVMWallet, fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "evm",
  title: "EVM Wallets",
  icon: Icon,
  fields,
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
