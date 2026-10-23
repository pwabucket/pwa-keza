import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "solana",
  title: "Solana Wallets",
  icon: Icon,
  fields,
  order: 50,
  tags: ["SOL", "WIF", "PENGU"],
  defaultExpanded: true,
});
