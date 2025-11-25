import type { WalletModule } from "../../types/wallet";
import Icon from "./icon.svg";
import Worker from "./worker?worker";

export default {
  id: "stellar",
  title: "Stellar Wallets",
  icon: Icon,
  tags: ["XLM", "SSLX", "USDC"],
  worker: Worker,
  defaultExpanded: true,
} as WalletModule;
