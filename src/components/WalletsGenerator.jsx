import toast from "react-hot-toast";
import { useCallback } from "react";

import InnerAppLayout from "../layouts/InnerAppLayout";
import WalletGeneratorInput from "../components/WalletGeneratorInput";
import WalletList from "./WalletList";
import useWallets from "../hooks/useWallets";

export default function WalletsGenerator({
  id,
  icon,
  title,
  generate,
  defaultExpanded = false,
}) {
  const { count, wallets, expanded, setExpanded, setCount, setWallets } =
    useWallets(defaultExpanded);

  const generateWallets = useCallback(async () => {
    setWallets(
      await toast.promise(generate(count), {
        loading: "Generating...",
        success: "Generated successfully!",
        error: (err) => `Error: ${err.message || err}`,
      })
    );
  }, [count, setWallets, generate]);

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
      />

      {wallets.length > 0 ? (
        <WalletList
          id={id}
          wallets={wallets}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      ) : (
        <p className="italic text-center p-4">Click generate to start...</p>
      )}
    </InnerAppLayout>
  );
}
