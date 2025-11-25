import type { WalletModule } from "../../types/wallet";
import Icon from "./icon.svg";
import Worker from "./worker?worker";

export default {
  id: "bitcoin",
  title: "Bitcoin Wallets",
  icon: Icon,
  tags: ["BTC"],
  worker: Worker,
} as WalletModule;
