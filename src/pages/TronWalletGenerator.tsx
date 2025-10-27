import TronIcon from "../assets/images/tron.svg";
import WalletsGenerator from "../components/WalletsGenerator";
import useTronWalletGenerator from "../hooks/useTronWalletGenerator";

export default function TronWalletGenerator() {
  const generateTronWallet = useTronWalletGenerator();

  return (
    <WalletsGenerator
      id={"tron"}
      title="Tron Wallets"
      icon={TronIcon}
      generate={generateTronWallet}
    />
  );
}
