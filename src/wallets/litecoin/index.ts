import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "litecoin",
  title: "Litecoin Wallets",
  icon: Icon,
  fields,
  tags: ["LTC"],
});
