import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "sui",
  title: "Sui Wallets",
  icon: Icon,
  fields,
  tags: ["SUI"],
});
