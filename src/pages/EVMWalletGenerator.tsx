import EVMIcon from "../assets/images/evm.svg";
import WalletsGenerator from "../components/WalletsGenerator";
import useEVMWalletGenerator from "../hooks/useEVMWalletGenerator";

export default function TONWalletGenerator() {
  const generateEVMWallet = useEVMWalletGenerator();

  return (
    <WalletsGenerator
      id="evm"
      title="EVM Wallets"
      icon={EVMIcon}
      generate={generateEVMWallet}
    />
  );
}
