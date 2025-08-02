import TONIcon from "../assets/images/ton.svg";
import WalletsGenerator from "../components/WalletsGenerator";
import useTONWalletGenerator from "../hooks/useTONWalletGenerator";

export default function TONWalletGenerator() {
  const generateTONWallet = useTONWalletGenerator();

  return (
    <WalletsGenerator
      id={"ton"}
      title="TON Wallets"
      icon={TONIcon}
      generate={generateTONWallet}
    />
  );
}
