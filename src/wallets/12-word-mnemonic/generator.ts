import { generateMnemonicPhrase } from "../mnemonic";

export default function generate12WordMnemonic() {
  return generateMnemonicPhrase(12);
}
