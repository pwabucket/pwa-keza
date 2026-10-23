import { generateMnemonicPhrase } from "../mnemonic";

export default function generate24WordMnemonic() {
  return generateMnemonicPhrase(24);
}
