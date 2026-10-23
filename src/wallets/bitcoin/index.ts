import type { WalletModule } from "../../types/wallet";
import Icon from "./icon.svg";

export default {
  id: "bitcoin",
  title: "Bitcoin Wallets",
  icon: Icon,
  tags: ["BTC"],
} satisfies WalletModule;
