import EVMIcon from "../assets/images/evm.svg";
import WalletsGenerator from "../components/WalletsGenerator";
import useEVMWalletGenerator from "../hooks/useEVMWalletGenerator";
import { getEVMParcelConfig } from "../wallets/evm";

export default function EVMWalletGenerator() {
  const generateEVMWallet = useEVMWalletGenerator();

  return (
    <WalletsGenerator
      id="evm"
      title="EVM Wallets"
      icon={EVMIcon}
      generate={generateEVMWallet}
      getParcelConfig={getEVMParcelConfig}
    />
  );
}
