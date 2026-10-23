import { useParams } from "@pwabucket/pwa-router";
import WalletsGenerator from "../components/WalletsGenerator";
import wallets from "../wallets";
import GeneratorContext from "../contexts/GeneratorContext";
import NotFound from "./NotFound";

export default function WalletGenerator() {
  const params = useParams();
  const id = params.id;
  const wallet = wallets.find((w) => w.id === id);

  if (!wallet) {
    return <NotFound title="Wallet not found" />;
  }

  return (
    <GeneratorContext.Provider value={wallet}>
      <WalletsGenerator />
    </GeneratorContext.Provider>
  );
}
