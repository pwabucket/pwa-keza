import BitcoinIcon from "../assets/images/bitcoin-btc-logo.svg";
import WalletsGenerator from "../components/WalletsGenerator";
import useBitcoinWalletGenerator from "../hooks/useBitcoinWalletGenerator";

export default function BitcoinWalletGenerator() {
  const generateBitcoinWallet = useBitcoinWalletGenerator();

  return (
    <WalletsGenerator
      id="bitcoin"
      title="Bitcoin Wallets"
      icon={BitcoinIcon}
      generate={generateBitcoinWallet}
    />
  );
}
