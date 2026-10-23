import type { WalletModule } from "../../types/wallet";
import Icon from "./icon.svg";

export default {
  id: "stellar",
  title: "Stellar Wallets",
  icon: Icon,
  tags: ["XLM", "SSLX", "USDC"],
  defaultExpanded: true,
} satisfies WalletModule;
