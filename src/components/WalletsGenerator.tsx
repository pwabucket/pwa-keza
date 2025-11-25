import toast from "react-hot-toast";
import { useCallback } from "react";

import InnerAppLayout from "../layouts/InnerAppLayout";
import WalletGeneratorInput from "../components/WalletGeneratorInput";
import WalletList from "./WalletList";
import useWallets from "../hooks/useWallets";
import useGeneratorContext from "../hooks/useGeneratorContext";
import useWalletWorker from "../hooks/useWalletWorker";

export default function WalletsGenerator() {
  const wallet = useGeneratorContext();
  const generate = useWalletWorker(wallet?.worker);
  const {
    count,
    wallets,
    expanded,
    setExpanded,
    setCount,
    setWallets,
    isTestnet,
    setIsTestnet,
  } = useWallets(wallet.defaultExpanded ?? false);

  /* Generate wallets */
  const generateWallets = useCallback(async () => {
    setWallets(
      await toast.promise(
        generate(count as number, {
          testnet: isTestnet,
        }),
        {
          loading: "Generating...",
          success: "Generated successfully!",
          error: (err) => `Error: ${err.message || err}`,
        }
      )
    );
  }, [count, isTestnet, setWallets, generate]);

  return (
    <InnerAppLayout
      headerMiddleContent={
        <div className="flex justify-center items-center gap-2">
          <img src={wallet.icon} className="size-8" />{" "}
          <h1 className="font-bold">{wallet.title}</h1>
        </div>
      }
    >
      <WalletGeneratorInput
        count={count}
        setCount={setCount}
        generate={generateWallets}
        isTestnet={isTestnet}
        setIsTestnet={setIsTestnet}
        supportsTestnet={wallet.supportsTestnet || false}
      />

      {wallets.length > 0 ? (
        <WalletList
          id={wallet.id}
          wallets={wallets}
          expanded={expanded}
          setExpanded={setExpanded}
          getParcelConfig={wallet.getParcelConfig}
        />
      ) : (
        <p className="italic text-center p-4">Click generate to start...</p>
      )}
    </InnerAppLayout>
  );
}
