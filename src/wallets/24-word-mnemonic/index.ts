import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "24-word-mnemonic",
  title: "24-Word Mnemonic Wallets",
  icon: Icon,
  fields,
  order: 20,
  tags: ["Tonkeeper", "Phantom"],
  defaultExpanded: true,
});
