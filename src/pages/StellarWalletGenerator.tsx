import StellarIcon from "../assets/images/stellar.svg";
import WalletsGenerator from "../components/WalletsGenerator";
import useStellarWalletGenerator from "../hooks/useStellarWalletGenerator";

export default function StellarWalletGenerator() {
  const generateStellarWallet = useStellarWalletGenerator();

  return (
    <WalletsGenerator
      id={"stellar"}
      title="Stellar Wallets"
      icon={StellarIcon}
      generate={generateStellarWallet}
      defaultExpanded
    />
  );
}
