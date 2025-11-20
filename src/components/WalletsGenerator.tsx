import toast from "react-hot-toast";
import { useCallback } from "react";

import InnerAppLayout from "../layouts/InnerAppLayout";
import WalletGeneratorInput from "../components/WalletGeneratorInput";
import WalletList from "./WalletList";
import useWallets from "../hooks/useWallets";
import type { GenerateWallet, GetParcelConfig } from "../types/wallet";

type WalletsGeneratorProps = {
  id: string;
  icon: string;
  title: string;
  generate: GenerateWallet;
  getParcelConfig?: GetParcelConfig<Record<string, string>>;
  defaultExpanded?: boolean;
  supportsTestnet?: boolean;
};

export default function WalletsGenerator({
  id,
  icon,
  title,
  generate,
  getParcelConfig,
  defaultExpanded = false,
  supportsTestnet = false,
}: WalletsGeneratorProps) {
  const {
    count,
    wallets,
    expanded,
    setExpanded,
    setCount,
    setWallets,
    isTestnet,
    setIsTestnet,
  } = useWallets(defaultExpanded);

  const generateWallets = useCallback(async () => {
    setWallets(
      await toast.promise(generate(count as number, isTestnet), {
        loading: "Generating...",
        success: "Generated successfully!",
        error: (err) => `Error: ${err.message || err}`,
      })
    );
  }, [count, isTestnet, setWallets, generate]);

  return (
    <InnerAppLayout
      headerMiddleContent={
        <div className="flex justify-center items-center gap-2">
          <img src={icon} className="size-8" />{" "}
          <h1 className="font-bold">{title}</h1>
        </div>
      }
    >
      <WalletGeneratorInput
        count={count}
        setCount={setCount}
        generate={generateWallets}
        isTestnet={isTestnet}
        setIsTestnet={setIsTestnet}
        supportsTestnet={supportsTestnet}
      />

      {wallets.length > 0 ? (
        <WalletList
          id={id}
          wallets={wallets}
          expanded={expanded}
          setExpanded={setExpanded}
          getParcelConfig={getParcelConfig}
        />
      ) : (
        <p className="italic text-center p-4">Click generate to start...</p>
      )}
    </InnerAppLayout>
  );
}
