import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "near",
  title: "NEAR Wallets",
  icon: Icon,
  fields,
  tags: ["NEAR"],
});
