import SolanaIcon from "../assets/images/solana.svg";
import WalletsGenerator from "../components/WalletsGenerator";
import useSolanaWalletGenerator from "../hooks/useSolanaWalletGenerator";

export default function SolanaWalletGenerator() {
  const generateSolanaWallet = useSolanaWalletGenerator();

  return (
    <WalletsGenerator
      id="solana"
      title="Solana Wallets"
      icon={SolanaIcon}
      generate={generateSolanaWallet}
    />
  );
}
