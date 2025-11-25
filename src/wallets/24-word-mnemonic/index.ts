import type { WalletModule } from "../../types/wallet";
import Icon from "./icon.svg";
import Worker from "./worker?worker";

export default {
  id: "24-word-mnemonic",
  title: "24-Word Mnemonic Wallets",
  icon: Icon,
  tags: ["Tonkeeper", "Phantom"],
  worker: Worker,
  defaultExpanded: true,
} as WalletModule;
