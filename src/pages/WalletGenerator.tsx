import { useParams } from "@pwabucket/pwa-router";

import NotFound from "./NotFound";
import SessionProvider from "../contexts/SessionProvider";
import WalletsGenerator from "../components/WalletsGenerator";
import { walletModulesById } from "../wallets/registry";

export default function WalletGenerator() {
  const params = useParams();
  const module = params.id ? walletModulesById.get(params.id) : undefined;

  if (!module) {
    return <NotFound title="Wallet not found" />;
  }

  return (
    <SessionProvider key={module.id} module={module}>
      <WalletsGenerator module={module} />
    </SessionProvider>
  );
}
