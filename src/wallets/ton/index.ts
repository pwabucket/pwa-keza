import { defineWalletModule } from "../define";
import { TONWallet, fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "ton",
  title: "TON Wallets",
  icon: Icon,
  fields,
  order: 60,
  tags: ["TON", "NOT", "DOGS"],
  supportsTestnet: true,
  getParcelConfig(wallets, { version = 5 }: { version?: number } = {}) {
    return {
      group: "ton",
      blockchain: "ton",
      recipients:
        version === 5
          ? wallets.map((w) => w[TONWallet.ADDRESS_V5])
          : wallets.map((w) => w[TONWallet.ADDRESS_V4]),
      senders:
        version === 5
          ? wallets.map((w) => ({
              address: w[TONWallet.ADDRESS_V5],
              mnemonic: w[TONWallet.PHRASE],
              version: 5,
            }))
          : wallets.map((w) => ({
              address: w[TONWallet.ADDRESS_V4],
              mnemonic: w[TONWallet.PHRASE],
              version: 4,
            })),
    };
  },
});
