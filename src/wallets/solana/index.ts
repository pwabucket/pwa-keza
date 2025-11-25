import type { WalletModule } from "../../types/wallet";
import Icon from "./icon.svg";
import Worker from "./worker?worker";

export default {
  id: "solana",
  title: "Solana Wallets",
  icon: Icon,
  tags: ["SOL", "WIF", "PENGU"],
  worker: Worker,
  defaultExpanded: true,
} as WalletModule;
