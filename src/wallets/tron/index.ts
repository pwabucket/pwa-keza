import type { WalletModule } from "../../types/wallet";
import Icon from "./icon.svg";
import Worker from "./worker?worker";

export default {
  id: "tron",
  title: "Tron Wallets",
  icon: Icon,
  tags: ["TRX", "SUN", "BTT"],
  worker: Worker,
} as WalletModule;
