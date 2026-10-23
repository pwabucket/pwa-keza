import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "12-word-mnemonic",
  title: "12-Word Mnemonic Wallets",
  icon: Icon,
  fields,
  order: 10,
  tags: ["Metamask", "Bitget Wallet"],
  defaultExpanded: true,
});
