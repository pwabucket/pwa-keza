import { useParams } from "react-router";
import WalletsGenerator from "../components/WalletsGenerator";
import wallets from "../wallets";
import GeneratorContext from "../contexts/GeneratorContext";

export default function WalletGenerator() {
  const params = useParams();
  const id = params.id;
  const wallet = wallets.find((w) => w.id === id);

  if (!wallet) {
    return <div>Wallet not found</div>;
  }

  return (
    <GeneratorContext.Provider value={wallet}>
      <WalletsGenerator />
    </GeneratorContext.Provider>
  );
}
