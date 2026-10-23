import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "cosmos",
  title: "Cosmos Wallets",
  icon: Icon,
  fields,
  tags: ["ATOM", "OSMO"],
});
