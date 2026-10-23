import toast from "react-hot-toast";
import { useCallback, useState } from "react";

import HeaderTitle from "../layouts/HeaderTitle";
import InnerAppLayout from "../layouts/InnerAppLayout";
import WalletGeneratorInput from "../components/WalletGeneratorInput";
import WalletList from "./WalletList";
import useWallets from "../hooks/useWallets";
import useGeneratorContext from "../hooks/useGeneratorContext";
import useWalletWorker from "../hooks/useWalletWorker";
import { MIN_WALLET_COUNT, clampCount, parseCount } from "../lib/count";

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
  const [isGenerating, setIsGenerating] = useState(false);

  /* Generate wallets */
  const generateWallets = useCallback(async () => {
    const parsedCount = parseCount(count);

    if (parsedCount === null || parsedCount < MIN_WALLET_COUNT) {
      toast.error("Enter how many wallets to generate.", { id: "count" });
      return;
    }

    const total = clampCount(parsedCount);

    setCount(total);
    setIsGenerating(true);

    try {
      const result = await toast.promise(
        generate(total, { testnet: isTestnet }).then((rows) => {
          if (rows.length === 0) {
            throw new Error("No wallets were generated");
          }
          return rows;
        }),
        {
          loading: "Generating...",
          success: "Generated successfully!",
          error: (err) => `Error: ${err.message || err}`,
        },
      );

      setWallets(result);
    } catch {
      /* The error toast already reports the failure */
    } finally {
      setIsGenerating(false);
    }
  }, [count, isTestnet, setCount, setWallets, generate]);

  return (
    <InnerAppLayout
      headerMiddleContent={
        <HeaderTitle icon={wallet.icon}>{wallet.title}</HeaderTitle>
      }
    >
      <WalletGeneratorInput
        count={count}
        setCount={setCount}
        generate={generateWallets}
        isGenerating={isGenerating}
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
        <p className="italic text-center p-4">Click Generate to start...</p>
      )}
    </InnerAppLayout>
  );
}
