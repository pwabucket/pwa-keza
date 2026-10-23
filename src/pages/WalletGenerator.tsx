import { useParams } from "@pwabucket/pwa-router";
import WalletsGenerator from "../components/WalletsGenerator";
import { walletModulesById } from "../wallets/registry";
import GeneratorContext from "../contexts/GeneratorContext";
import NotFound from "./NotFound";

export default function WalletGenerator() {
  const params = useParams();
  const wallet = params.id ? walletModulesById.get(params.id) : undefined;

  if (!wallet) {
    return <NotFound title="Wallet not found" />;
  }

  return (
    <GeneratorContext.Provider value={wallet}>
      <WalletsGenerator />
    </GeneratorContext.Provider>
  );
}
