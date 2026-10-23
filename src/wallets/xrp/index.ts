import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "xrp",
  title: "XRP Wallets",
  icon: Icon,
  fields,
  tags: ["XRP"],
});
