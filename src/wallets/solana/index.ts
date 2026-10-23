import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "solana",
  title: "Solana Wallets",
  icon: Icon,
  fields,
  tags: ["SOL", "WIF", "PENGU"],
  defaultExpanded: true,
});
