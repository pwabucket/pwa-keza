import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "bitcoin",
  title: "Bitcoin Wallets",
  icon: Icon,
  fields,
  tags: ["BTC"],
});
