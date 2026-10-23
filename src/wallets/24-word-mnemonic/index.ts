import type { WalletModule } from "../../types/wallet";
import Icon from "./icon.svg";

export default {
  id: "24-word-mnemonic",
  title: "24-Word Mnemonic Wallets",
  icon: Icon,
  tags: ["Tonkeeper", "Phantom"],
  defaultExpanded: true,
} satisfies WalletModule;
