import type { WalletModule } from "../../types/wallet";
import Icon from "./icon.svg";

export default {
  id: "solana",
  title: "Solana Wallets",
  icon: Icon,
  tags: ["SOL", "WIF", "PENGU"],
  defaultExpanded: true,
} satisfies WalletModule;
