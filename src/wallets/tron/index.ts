import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "tron",
  title: "Tron Wallets",
  icon: Icon,
  fields,
  order: 70,
  tags: ["TRX", "SUN", "BTT"],
});
