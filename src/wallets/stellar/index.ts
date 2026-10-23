import { defineWalletModule } from "../define";
import { fields } from "./fields";
import Icon from "./icon.svg";

export default defineWalletModule({
  id: "stellar",
  title: "Stellar Wallets",
  icon: Icon,
  fields,
  tags: ["XLM", "SSLX", "USDC"],
  defaultExpanded: true,
});
