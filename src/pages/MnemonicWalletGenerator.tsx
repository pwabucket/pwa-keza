import Number12Icon from "../assets/images/number-12.svg";
import Number24Icon from "../assets/images/number-24.svg";
import WalletsGenerator from "../components/WalletsGenerator";
import useMnemonicWalletGenerator from "../hooks/useMnemonicWalletGenerator";

export default function MnemonicWalletGenerator({
  strength = 12,
}: {
  strength?: 12 | 24;
}) {
  const generateWallet = useMnemonicWalletGenerator(strength);

  return (
    <WalletsGenerator
      id={`${strength}-word-mnemonic`}
      title={`${strength}-Word Mnemonic Wallets`}
      icon={strength === 12 ? Number12Icon : Number24Icon}
      generate={generateWallet}
      defaultExpanded
    />
  );
}
