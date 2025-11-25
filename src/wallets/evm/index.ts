import type { WalletModule } from "../../types/wallet";
import { EVMWallet } from "./constants";
import Icon from "./icon.svg";
import Worker from "./worker?worker";

export default {
  id: "evm",
  title: "EVM Wallets",
  icon: Icon,
  tags: ["ETH", "BNB", "POL"],
  worker: Worker,
  getParcelConfig(wallets: Record<string, string>[]) {
    return {
      group: "evm",
      recipients: wallets.map((w) => w[EVMWallet.ADDRESS]),
      senders: wallets.map((w) => ({
        address: w[EVMWallet.ADDRESS],
        privateKey: w[EVMWallet.PRIVATE_KEY],
      })),
    };
  },
} as WalletModule;
