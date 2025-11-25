import type { WalletModule } from "../../types/wallet";
import Icon from "./icon.svg";
import Worker from "./worker?worker";

export default {
  id: "12-word-mnemonic",
  title: "12-Word Mnemonic Wallets",
  icon: Icon,
  tags: ["Metamask", "Bitget Wallet"],
  worker: Worker,
  defaultExpanded: true,
} as WalletModule;
