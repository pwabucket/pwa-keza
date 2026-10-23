import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "bitcoin",
  title: "Bitcoin Wallets",
  icon: Icon,
  fields,
  order: 30,
  tags: ["BTC"],
  supportsTestnet: true,
});
