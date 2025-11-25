import type { WalletModule } from "../../types/wallet";
import { TONWallet } from "./generator";
import Icon from "./icon.svg";
import Worker from "./worker?worker";

export default {
  id: "ton",
  title: "TON Wallets",
  icon: Icon,
  tags: ["TON", "TONCOIN", "TONOS"],
  supportsTestnet: true,
  worker: Worker,
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
} as WalletModule;
