import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "aptos",
  title: "Aptos Wallets",
  icon: Icon,
  fields,
  tags: ["APT"],
});
