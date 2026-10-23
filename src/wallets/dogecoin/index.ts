import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "dogecoin",
  title: "Dogecoin Wallets",
  icon: Icon,
  fields,
  tags: ["DOGE"],
});
